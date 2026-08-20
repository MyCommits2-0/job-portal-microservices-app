package com.backend.app.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.backend.app.enums.JobStatus;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.client.AuthClient;
import com.backend.app.client.JobClient;
import com.backend.app.client.ProfileClient;
import com.backend.app.entities.ApplicationColumn;
import com.backend.app.dto.UserInternalResponse;
import com.backend.app.dto.ApplicationCardResponse;
import com.backend.app.dto.ApplicationDetailsResponse;
import com.backend.app.dto.ApplicationResponse;
import com.backend.app.dto.ApplicationStatusHistoryResponse;
import com.backend.app.dto.ApplyJobRequest;
import com.backend.app.dto.CandidateApplicationDashboardCountsResponse;
import com.backend.app.dto.JobInternalResponse;
import com.backend.app.dto.MyApplicationResponse;
import com.backend.app.dto.ResumeInternalResponse;
import com.backend.app.enums.ApplicationStatus;
import com.backend.app.entities.ApplicationStatusHistory;
import com.backend.app.entities.JobApplication;
import com.backend.app.exception.ApplicationNotFoundException;
import com.backend.app.exception.DuplicateApplicationException;
import com.backend.app.exception.InvalidApplicationStateException;
import com.backend.app.exception.ResumeNotFoundException;
import com.backend.app.exception.UnauthorizedActionException;
import com.backend.app.repository.ApplicationStatusHistoryRepository;
import com.backend.app.repository.JobApplicationRepository;

import feign.FeignException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class ApplicationServiceImpl implements ApplicationService {

    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED_TRANSITIONS = Map.of(
            ApplicationStatus.APPLIED, Set.of(ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED),
            ApplicationStatus.SHORTLISTED, Set.of(ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED),
            ApplicationStatus.INTERVIEW, Set.of(ApplicationStatus.HIRED, ApplicationStatus.REJECTED)
    );

    private final JobApplicationRepository applicationRepository;

    private final ApplicationStatusHistoryRepository statusHistoryRepository;

    private final ModelMapper mapper;

    private final JobClient jobClient;

    private final ProfileClient profileClient;

    private final AuthClient authClient;

    private final ApplicationColumnService columnService;

    @Override
    public ApplicationResponse applyJob(Long candidateId, Long jobId, ApplyJobRequest dto) {

        // Check if candidate has already applied
        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidateId)) {
            throw new DuplicateApplicationException(
                    "You have already applied for this job.");
        }

        JobInternalResponse job = jobClient.getJobById(jobId);

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new InvalidApplicationStateException("Job is not active");
        }

        Long resolvedResumeId = resolveResumeId(candidateId, dto.getResumeId());

        // Convert DTO to Entity
        JobApplication application = mapper.map(dto, JobApplication.class);

        application.setJobId(jobId);
        application.setCandidateId(candidateId);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setResumeId(resolvedResumeId);
        application.setNote(dto.getNote());

        application.setRecruiterId(job.getRecruiterId());

        // Without this, a new application saves with column=null and never appears in any
        // of the recruiter's board columns (each is filtered by exact columnId match), even
        // though it exists and getApplicationsForJob returns it.
        ApplicationColumn appliedColumn =
                columnService.getOrCreateAppliedColumn(jobId, job.getRecruiterId());
        application.setColumn(appliedColumn);

        application.setJobTitleSnapshot(job.getTitle());
        application.setCompanyNameSnapshot(job.getCompanyName());
        application.setJobLocationSnapshot(job.getLocation());
        application.setMinSalarySnapshot(job.getMinSalary());
        application.setMaxSalarySnapshot(job.getMaxSalary());
        application.setJobTypeSnapshot(job.getJobType());

        // Save into database
        JobApplication savedApplication = applicationRepository.save(application);

        recordHistory(savedApplication, null, ApplicationStatus.APPLIED, candidateId);

        // Convert Entity to Response DTO
        ApplicationResponse response =
                mapper.map(savedApplication, ApplicationResponse.class);

        response.setMessage("Application submitted successfully.");

        return response;
    }

    private Long resolveResumeId(Long candidateId, Long requestedResumeId) {

        List<ResumeInternalResponse> resumes;

        try {
            resumes = profileClient.getResumesByUserId(candidateId);
        } catch (FeignException.NotFound ex) {
            throw new ResumeNotFoundException(
                    "Please complete your candidate profile before applying.");
        }

        if (resumes == null || resumes.isEmpty()) {
            throw new ResumeNotFoundException(
                    "Please upload a resume before applying for this job.");
        }

        if (requestedResumeId != null) {
            return resumes.stream()
                    .filter(resume -> resume.getId().equals(requestedResumeId))
                    .map(ResumeInternalResponse::getId)
                    .findFirst()
                    .orElseThrow(() -> new ResumeNotFoundException(
                            "Selected resume was not found in your profile."));
        }

        return resumes.stream()
                .filter(ResumeInternalResponse::isDefaultResume)
                .map(ResumeInternalResponse::getId)
                .findFirst()
                .orElseThrow(() -> new ResumeNotFoundException(
                        "Please set a default resume in Settings before applying, or select a resume."));
    }

    @Override
    public List<MyApplicationResponse> getMyApplication(Long candidateId) {
        List<JobApplication> applications =
                applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidateId);
        return applications.stream().map(this::mapToMyApplicationResponse).toList();
    }

    private MyApplicationResponse mapToMyApplicationResponse(JobApplication application) {
        return mapper.map(application, MyApplicationResponse.class);
    }

    @Override
    public ApplicationDetailsResponse getApplication(Long applicationId, Long requesterId, String role) {

        JobApplication application = findApplicationOrThrow(applicationId);

        assertCanView(application, requesterId, role);

        ApplicationDetailsResponse response = mapper.map(application, ApplicationDetailsResponse.class);
        response.setApplicationId(application.getId());

        enrichWithCandidateAndResume(response, application.getCandidateId(), application.getResumeId());

        return response;
    }

    // Candidate name/resume file details live in Auth_User-Service and Profile-Service
    // respectively, not in this service's own data - fetched here rather than stored
    // on JobApplication itself, since only the job snapshot (not the candidate's own
    // info) needs to survive changes made after the application was submitted.
    private void enrichWithCandidateAndResume(
            ApplicationDetailsResponse response, Long candidateId, Long resumeId) {

        try {
            UserInternalResponse candidate = authClient.getUserById(candidateId);
            response.setCandidateName(candidate.getFullName());
            response.setCandidateEmail(candidate.getEmail());
        } catch (FeignException ignored) {
            // Candidate lookup failing shouldn't block viewing the application itself.
        }

        if (resumeId != null) {
            try {
                profileClient.getResumesByUserId(candidateId).stream()
                        .filter(resume -> resume.getId().equals(resumeId))
                        .findFirst()
                        .ifPresent(resume -> {
                            response.setResumeFileUrl(resume.getFileUrl());
                            response.setResumeFileName(resume.getFileName());
                        });
            } catch (FeignException ignored) {
                // Same reasoning - a resume lookup failure shouldn't hide the application.
            }
        }
    }

    @Override
    public ApplicationResponse withdrawApplication(Long applicationId, Long candidateId) {

        JobApplication application = findApplicationOrThrow(applicationId);

        if (!application.getCandidateId().equals(candidateId)) {
            throw new UnauthorizedActionException(
                    "You are not allowed to withdraw this application");
        }

        ApplicationStatus currentStatus = application.getStatus();

        if (currentStatus == ApplicationStatus.WITHDRAWN
                || currentStatus == ApplicationStatus.HIRED
                || currentStatus == ApplicationStatus.REJECTED) {
            throw new InvalidApplicationStateException(
                    "Application can no longer be withdrawn");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);

        JobApplication updatedApplication =
                applicationRepository.save(application);

        recordHistory(updatedApplication, currentStatus, ApplicationStatus.WITHDRAWN, candidateId);

        ApplicationResponse response =
                mapper.map(updatedApplication, ApplicationResponse.class);

        response.setMessage("Application withdrawn successfully.");

        return response;
    }

    @Override
    public ApplicationResponse updateApplicationStatus(
            Long applicationId, Long recruiterId, ApplicationStatus newStatus) {

        JobApplication application = findApplicationOrThrow(applicationId);

        if (!application.getRecruiterId().equals(recruiterId)) {
            throw new UnauthorizedActionException(
                    "You are not allowed to update this application");
        }

        ApplicationStatus currentStatus = application.getStatus();

        validateTransition(currentStatus, newStatus);

        application.setStatus(newStatus);

        JobApplication updated = applicationRepository.save(application);

        recordHistory(updated, currentStatus, newStatus, recruiterId);

        ApplicationResponse response = mapper.map(updated, ApplicationResponse.class);
        response.setMessage("Application status updated to " + newStatus.name());

        return response;
    }

    private void validateTransition(ApplicationStatus current, ApplicationStatus target) {

        if (target == ApplicationStatus.APPLIED || target == ApplicationStatus.WITHDRAWN) {
            throw new InvalidApplicationStateException(
                    "Status cannot be set to " + target.name() + " through this endpoint");
        }

        Set<ApplicationStatus> allowed = ALLOWED_TRANSITIONS.get(current);

        if (allowed == null || !allowed.contains(target)) {
            throw new InvalidApplicationStateException(
                    "Cannot move application from " + current.name() + " to " + target.name());
        }
    }

    @Override
    public List<ApplicationStatusHistoryResponse> getApplicationHistory(
            Long applicationId, Long requesterId, String role) {

        JobApplication application = findApplicationOrThrow(applicationId);

        assertCanView(application, requesterId, role);

        return statusHistoryRepository.findByApplication_IdOrderByChangedAtAsc(applicationId)
                .stream()
                .map(this::mapToHistoryResponse)
                .toList();
    }

    @Override
    public CandidateApplicationDashboardCountsResponse getCandidateDashboardCounts(Long candidateId) {

        long total = applicationRepository.countByCandidateId(candidateId);
        long shortlisted = applicationRepository.countByCandidateIdAndStatus(candidateId, ApplicationStatus.SHORTLISTED);
        long interview = applicationRepository.countByCandidateIdAndStatus(candidateId, ApplicationStatus.INTERVIEW);
        long hired = applicationRepository.countByCandidateIdAndStatus(candidateId, ApplicationStatus.HIRED);
        long rejected = applicationRepository.countByCandidateIdAndStatus(candidateId, ApplicationStatus.REJECTED);
        long withdrawn = applicationRepository.countByCandidateIdAndStatus(candidateId, ApplicationStatus.WITHDRAWN);

        return new CandidateApplicationDashboardCountsResponse(
                total, shortlisted, interview, hired, rejected, withdrawn);
    }

    @Override
    public List<ApplicationCardResponse> getApplicationsForJob(Long jobId, Long recruiterId) {

        List<JobApplication> applications =
                applicationRepository.findByJobIdAndRecruiterIdOrderByAppliedAtDesc(jobId, recruiterId);

        return applications.stream().map(this::mapToCardResponse).toList();
    }

    private ApplicationCardResponse mapToCardResponse(JobApplication application) {

        ApplicationCardResponse card = new ApplicationCardResponse(
                application.getId(),
                application.getCandidateId(),
                null,
                application.getResumeId(),
                null,
                null,
                application.getNote(),
                application.getStatus(),
                application.getColumn() != null ? application.getColumn().getId() : null,
                application.getAppliedAt()
        );

        try {
            UserInternalResponse candidate = authClient.getUserById(application.getCandidateId());
            card.setCandidateName(candidate.getFullName());
        } catch (FeignException e) {
            // A missing candidate name shouldn't stop the whole board from loading, but a
            // silently swallowed failure here is exactly what makes "why is the name blank"
            // impossible to diagnose - log it instead of losing it.
            log.warn(
                    "Could not resolve candidate name for candidateId={} (application={}): {} {}",
                    application.getCandidateId(), application.getId(), e.status(), e.getMessage()
            );
        }

        if (application.getResumeId() != null) {
            try {
                profileClient.getResumesByUserId(application.getCandidateId()).stream()
                        .filter(resume -> resume.getId().equals(application.getResumeId()))
                        .findFirst()
                        .ifPresent(resume -> {
                            card.setResumeFileUrl(resume.getFileUrl());
                            card.setResumeFileName(resume.getFileName());
                        });
            } catch (FeignException e) {
                log.warn(
                        "Could not resolve resume for candidateId={} resumeId={} (application={}): {} {}",
                        application.getCandidateId(), application.getResumeId(), application.getId(),
                        e.status(), e.getMessage()
                );
            }
        }

        return card;
    }

    private JobApplication findApplicationOrThrow(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));
    }

    private void assertCanView(JobApplication application, Long requesterId, String role) {

        boolean isOwnerCandidate = "CANDIDATE".equalsIgnoreCase(role)
                && application.getCandidateId().equals(requesterId);

        boolean isOwnerRecruiter = "RECRUITER".equalsIgnoreCase(role)
                && application.getRecruiterId().equals(requesterId);

        if (!isOwnerCandidate && !isOwnerRecruiter) {
            throw new UnauthorizedActionException(
                    "You are not allowed to view this application");
        }
    }

    private void recordHistory(
            JobApplication application,
            ApplicationStatus oldStatus,
            ApplicationStatus newStatus,
            Long changedBy) {

        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(application);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);

        statusHistoryRepository.save(history);
    }

    private ApplicationStatusHistoryResponse mapToHistoryResponse(ApplicationStatusHistory history) {
        return new ApplicationStatusHistoryResponse(
                history.getId(),
                history.getOldStatus(),
                history.getNewStatus(),
                history.getChangedBy(),
                history.getChangedAt()
        );
    }
}

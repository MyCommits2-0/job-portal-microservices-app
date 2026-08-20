package com.backend.profile.service;

import com.backend.profile.dtos.CloudinaryUploadResponse;
import com.backend.profile.dtos.ResumeResponseDto;
import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.Resume;
import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.ResumeRepository;
import com.backend.profile.exceptions.ResourceNotFoundException;
import com.backend.profile.service.CloudinaryService;
import com.backend.profile.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public List<ResumeResponseDto> getCandidateResumes(Long candidateProfileId) {

        List<Resume> resumes = resumeRepository.findByCandidateId(candidateProfileId);

        return resumes.stream()
                .map(this::mapToResumeResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeResponseDto> getResumesByUserId(Long userId) {

        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidate profile not found for this user"));

        return getCandidateResumes(candidate.getId());
    }

    @Override
    public ResumeResponseDto uploadResume(Long candidateProfileId, MultipartFile file, boolean defaultResume) {

        CandidateProfile candidate = candidateProfileRepository.findById(candidateProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        CloudinaryUploadResponse uploadResponse = cloudinaryService.uploadResume(file, candidateProfileId);

        if (defaultResume) {
            resumeRepository.clearDefaultResume(candidateProfileId);
        }

        Resume resume = new Resume();
        resume.setCandidate(candidate);
        resume.setFileName(uploadResponse.getOriginalFileName());
        resume.setFileUrl(uploadResponse.getFileUrl());
        resume.setCloudinaryPublicId(uploadResponse.getPublicId());
        resume.setResourceType(uploadResponse.getResourceType());
        resume.setDefaultResume(defaultResume);

        Resume saved = resumeRepository.save(resume);

        return mapToResumeResponseDto(saved);
    }

    @Override
    public ResumeResponseDto setDefaultResume(Long candidateProfileId, Long resumeId) {

        Resume resume = resumeRepository.findByIdAndCandidateId(resumeId, candidateProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found for candidate"));

        resumeRepository.clearDefaultResume(candidateProfileId);

        resume.setDefaultResume(true);

        Resume saved = resumeRepository.save(resume);

        return mapToResumeResponseDto(saved);
    }

    @Override
    public void deleteResume(Long resumeId) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (resume.getCloudinaryPublicId() != null && !resume.getCloudinaryPublicId().isBlank()) {
            cloudinaryService.deleteFile(
                    resume.getCloudinaryPublicId(),
                    resume.getResourceType()
            );
        }

        resumeRepository.delete(resume);
    }

    private ResumeResponseDto mapToResumeResponseDto(Resume resume) {
        return new ResumeResponseDto(
                resume.getId(),
                resume.getFileName(),
                resume.getFileUrl(),
                resume.getCloudinaryPublicId(),
                resume.getResourceType(),
                resume.isDefaultResume()
        );
    }
}
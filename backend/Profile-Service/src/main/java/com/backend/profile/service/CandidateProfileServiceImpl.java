package com.backend.profile.service;

import java.util.List;

import com.backend.profile.dtos.CandidateAccountSettingResponseDto;
import com.backend.profile.dtos.CandidatePersonalInfoRequestDto;
import com.backend.profile.dtos.CandidatePersonalInfoResponseDto;
import com.backend.profile.dtos.CandidateProfileResponseDto;
import com.backend.profile.dtos.CloudinaryUploadResponse;
import com.backend.profile.dtos.CreateCandidateProfileRequestDto;
import com.backend.profile.dtos.CreateCandidateProfileResponseDto;
import com.backend.profile.dtos.EducationResponseDto;
import com.backend.profile.dtos.ExperienceResponseDto;
import com.backend.profile.dtos.ResumeResponseDto;
import com.backend.profile.dtos.SkillResponseDto;
import com.backend.profile.dtos.SocialLinkResponseDto;
import com.backend.profile.entities.CandidateAccountSetting;
import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.Resume;
import com.backend.daos.CandidateAccountSettingRepository;
import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.CandidateSkillRepository;
import com.backend.daos.ResumeRepository;
import com.backend.profile.exceptions.ResourceNotFoundException;
import com.backend.profile.service.CandidateProfileService;
import com.backend.profile.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateProfileServiceImpl implements CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final ResumeRepository resumeRepository;
    private final CandidateAccountSettingRepository candidateAccountSettingRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final CloudinaryService cloudinaryService;
    private final ModelMapper modelMapper;

    @Override
    public CandidatePersonalInfoResponseDto updatePersonalInfo(
            Long candidateId,
            CandidatePersonalInfoRequestDto requestDto
    ) {
        CandidateProfile candidateProfile = candidateProfileRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        updateBasicFields(candidateProfile, requestDto);

        if (hasFile(requestDto.getProfileImage())) {
            uploadAndSetProfileImage(candidateProfile, requestDto.getProfileImage(), candidateId);
        }

        Resume savedResume = null;

        if (hasFile(requestDto.getResume())) {
            savedResume = uploadAndSaveResume(candidateProfile, requestDto.getResume(), requestDto.isDefaultResume());
        }

        CandidateProfile savedCandidateProfile = candidateProfileRepository.save(candidateProfile);

        return new CandidatePersonalInfoResponseDto(
                "success",
                "Personal information saved successfully",
                savedCandidateProfile.getId(),
                savedCandidateProfile.getPhone(),
                savedCandidateProfile.getProfileTitle(),
                savedCandidateProfile.getLocation(),
                savedCandidateProfile.getBio(),
                savedCandidateProfile.getExpectedSalary(),
                savedCandidateProfile.getExperienceLevel(),
                savedCandidateProfile.getProfileImageUrl(),
                savedResume != null ? savedResume.getId() : null,
                savedResume != null ? savedResume.getFileName() : null,
                savedResume != null ? savedResume.getFileUrl() : null,
                savedResume != null && savedResume.isDefaultResume(),
                "PROFILE"
        );
    }

    private void updateBasicFields(
            CandidateProfile candidateProfile,
            CandidatePersonalInfoRequestDto requestDto
    ) {
        candidateProfile.setPhone(requestDto.getPhone());
        candidateProfile.setProfileTitle(requestDto.getProfileTitle());
        candidateProfile.setLocation(requestDto.getLocation());
        candidateProfile.setBio(requestDto.getBio());
        candidateProfile.setExpectedSalary(requestDto.getExpectedSalary());
        candidateProfile.setExperienceLevel(requestDto.getExperienceLevel());
    }

    private void uploadAndSetProfileImage(
            CandidateProfile candidateProfile,
            MultipartFile profileImage,
            Long candidateId
    ) {
        CloudinaryUploadResponse imageUploadResponse =
                cloudinaryService.uploadImage(
                        profileImage,
                        "job-portal/candidates/" + candidateId + "/profile-image"
                );

        candidateProfile.setProfileImageUrl(imageUploadResponse.getFileUrl());
        candidateProfile.setProfileImagePublicId(imageUploadResponse.getPublicId());
        candidateProfile.setProfileImageResourceType(imageUploadResponse.getResourceType());
    }

    private Resume uploadAndSaveResume(
            CandidateProfile candidateProfile,
            MultipartFile resumeFile,
            boolean defaultResume
    ) {
        CloudinaryUploadResponse resumeUploadResponse =
                cloudinaryService.uploadResume(resumeFile, candidateProfile.getId());

        if (defaultResume) {
            resumeRepository.clearDefaultResume(candidateProfile.getId());
        }

        Resume resume = new Resume();
        resume.setCandidate(candidateProfile);
        resume.setFileName(resumeUploadResponse.getOriginalFileName());
        resume.setFileUrl(resumeUploadResponse.getFileUrl());
        resume.setCloudinaryPublicId(resumeUploadResponse.getPublicId());
        resume.setResourceType(resumeUploadResponse.getResourceType());
        resume.setDefaultResume(defaultResume);

        return resumeRepository.save(resume);
    }

    private boolean hasFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }
    
    
    @Override
    public CreateCandidateProfileResponseDto createCandidateProfile(
            CreateCandidateProfileRequestDto requestDto
    ) {
        Long userId = requestDto.getUserId();

        if (userId == null) {
            throw new RuntimeException("User id is required");
        }

        // Idempotent by design: this is called as a "make sure a profile exists" bootstrap
        // step (there is no Auth Service session yet to resolve the candidate's own profile
        // id from), so a repeat call for the same user must return the existing profile
        // instead of throwing.
        CandidateProfile existing = candidateProfileRepository.findByUserId(userId).orElse(null);

        if (existing != null) {
        	System.out.println("Existing profile = " + existing);
            return new CreateCandidateProfileResponseDto(
                    "success",
                    "Candidate profile already exists",
                    existing.getId(),
                    existing.getUserId()
            );
        }

        CandidateProfile candidateProfile = new CandidateProfile();
        candidateProfile.setUserId(userId);
        candidateProfile.setProfileCompleted(false);

        CandidateProfile savedProfile;
        try {
            savedProfile = candidateProfileRepository.save(candidateProfile);
        } catch (DataIntegrityViolationException e) {
            // The findByUserId() check above isn't atomic with this insert - two concurrent
            // bootstrap calls for the same brand-new user (e.g. the dashboard and settings
            // page both resolving it on mount) can both miss the check and race here. The
            // loser hits user_id's unique constraint; re-fetch instead of failing, since the
            // winner's row is exactly what this call is trying to return anyway.
            savedProfile = candidateProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> e);
        }

        return new CreateCandidateProfileResponseDto(
                "success",
                "Candidate profile created successfully",
                savedProfile.getId(),
                savedProfile.getUserId()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileResponseDto getCandidateProfile(Long candidateId) {

        CandidateProfile candidate = candidateProfileRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        List<EducationResponseDto> educationList = candidate.getEducationList().stream()
                .map(edu -> modelMapper.map(edu, EducationResponseDto.class))
                .toList();

        List<ExperienceResponseDto> experienceList = candidate.getExperienceList().stream()
                .map(exp -> modelMapper.map(exp, ExperienceResponseDto.class))
                .toList();

        // findByCandidateIdWithSkill JOIN FETCHes the related Skill in this one query,
        // instead of candidate.getCandidateSkills() triggering a separate lazy SELECT for
        // cs.getSkill() on every iteration below (that was the actual N+1: query count grew
        // with the candidate's skill count, unlike the other fixed, one-per-collection queries
        // on this method, which don't scale with data size).
        List<SkillResponseDto> skills = candidateSkillRepository.findByCandidateIdWithSkill(candidateId).stream()
                .map(cs -> new SkillResponseDto(cs.getId(), cs.getSkill().getName()))
                .toList();

        List<ResumeResponseDto> resumes = candidate.getResumes().stream()
                .map(resume -> modelMapper.map(resume, ResumeResponseDto.class))
                .toList();

        List<SocialLinkResponseDto> socialLinks = candidate.getSocialLinks().stream()
                .map(link -> modelMapper.map(link, SocialLinkResponseDto.class))
                .toList();

        // candidate.getAccountSetting() now works correctly (CandidateProfile.accountSetting
        // has a proper mappedBy), but this direct repository lookup is kept anyway since it's
        // one explicit query rather than relying on the inverse side of a lazy @OneToOne.
        CandidateAccountSettingResponseDto accountSetting = candidateAccountSettingRepository
                .findByCandidateId(candidateId)
                .map(this::mapToAccountSettingResponseDto)
                .orElse(null);

        boolean profileCompleted = isProfileComplete(candidate, educationList, experienceList, skills, resumes);

        return new CandidateProfileResponseDto(
                candidate.getId(),
                candidate.getUserId(),
                candidate.getPhone(),
                candidate.getProfileTitle(),
                candidate.getProfileImageUrl(),
                candidate.getLocation(),
                candidate.getBio(),
                candidate.getExpectedSalary(),
                candidate.getExperienceLevel(),
                profileCompleted,
                educationList,
                experienceList,
                skills,
                resumes,
                socialLinks,
                accountSetting
        );
    }

    // candidateProfile.profileCompleted is never persisted/updated elsewhere, so derive
    // it here from whether the core sections of the profile are actually filled in.
    private boolean isProfileComplete(
            CandidateProfile candidate,
            List<EducationResponseDto> educationList,
            List<ExperienceResponseDto> experienceList,
            List<SkillResponseDto> skills,
            List<ResumeResponseDto> resumes
    ) {
        boolean personalInfoFilled =
                hasText(candidate.getPhone())
                        && hasText(candidate.getProfileTitle())
                        && hasText(candidate.getLocation())
                        && hasText(candidate.getExperienceLevel());

        return personalInfoFilled
                && !educationList.isEmpty()
                && !experienceList.isEmpty()
                && !skills.isEmpty()
                && !resumes.isEmpty();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private CandidateAccountSettingResponseDto mapToAccountSettingResponseDto(CandidateAccountSetting setting) {
        return new CandidateAccountSettingResponseDto(
                setting.getId(),
                setting.isProfileVisible(),
                setting.isJobAlertEnabled(),
                setting.isEmailNotificationEnabled()
        );
    }
}
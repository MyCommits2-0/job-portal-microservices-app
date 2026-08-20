package com.backend.profile.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.daos.CompanyRepository;
import com.backend.daos.RecruiterAccountSettingRepository;
import com.backend.daos.RecruiterProfileRepository;
import com.backend.profile.dtos.CompanyResponseDto;
import com.backend.profile.dtos.CreateRecruiterProfileRequestDto;
import com.backend.profile.dtos.CreateRecruiterProfileResponseDto;
import com.backend.profile.dtos.RecruiterAccountSettingResponseDto;
import com.backend.profile.dtos.RecruiterPersonalInfoRequestDto;
import com.backend.profile.dtos.RecruiterPersonalInfoResponseDto;
import com.backend.profile.dtos.RecruiterProfileResponseDto;
import com.backend.profile.entities.Company;
import com.backend.profile.entities.RecruiterAccountSetting;
import com.backend.profile.entities.RecruiterProfile;
import com.backend.profile.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RecruiterProfileServiceImpl implements RecruiterProfileService {

    private final RecruiterProfileRepository recruiterProfileRepository;

    private final CompanyRepository companyRepository;

    private final RecruiterAccountSettingRepository recruiterAccountSettingRepository;

    @Override
    public CreateRecruiterProfileResponseDto createRecruiterProfile(CreateRecruiterProfileRequestDto requestDto) {

        Long userId = requestDto.getUserId();

        if (userId == null) {
            throw new RuntimeException("User id is required");
        }

        // Idempotent by design - see CandidateProfileServiceImpl.createCandidateProfile for why.
        RecruiterProfile existingRecruiter = recruiterProfileRepository.findByUserId(userId).orElse(null);

        if (existingRecruiter != null) {
            return new CreateRecruiterProfileResponseDto(
                    "success",
                    "Recruiter profile already exists",
                    existingRecruiter.getId(),
                    existingRecruiter.getUserId()
            );
        }

        RecruiterProfile recruiterProfile = new RecruiterProfile();
        recruiterProfile.setUserId(userId);
        recruiterProfile.setProfileCompleted(false);

        RecruiterProfile savedProfile;
        try {
            savedProfile = recruiterProfileRepository.save(recruiterProfile);
        } catch (DataIntegrityViolationException e) {
            // See CandidateProfileServiceImpl.createCandidateProfile for why this can race.
            savedProfile = recruiterProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> e);
        }

        return new CreateRecruiterProfileResponseDto(
                "success",
                "Recruiter profile created successfully",
                savedProfile.getId(),
                savedProfile.getUserId()
        );
    }

    @Override
    public RecruiterPersonalInfoResponseDto updatePersonalInfo(Long recruiterId, RecruiterPersonalInfoRequestDto requestDto) {

        RecruiterProfile recruiterProfile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        recruiterProfile.setPhone(requestDto.getPhone());
        recruiterProfile.setDesignation(requestDto.getDesignation());

        RecruiterProfile saved = recruiterProfileRepository.save(recruiterProfile);

        return new RecruiterPersonalInfoResponseDto(
                "success",
                "Personal information saved successfully",
                saved.getId(),
                saved.getPhone(),
                saved.getDesignation(),
                "COMPANY"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterProfileResponseDto getRecruiterProfile(Long recruiterId) {

        RecruiterProfile recruiterProfile = recruiterProfileRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        CompanyResponseDto company = companyRepository.findByRecruiterId(recruiterId)
                .map(this::mapToCompanyResponseDto)
                .orElse(null);

        RecruiterAccountSettingResponseDto accountSetting = recruiterAccountSettingRepository
                .findByRecruiterId(recruiterId)
                .map(this::mapToAccountSettingResponseDto)
                .orElse(null);

        return new RecruiterProfileResponseDto(
                recruiterProfile.getId(),
                recruiterProfile.getUserId(),
                recruiterProfile.getPhone(),
                recruiterProfile.getDesignation(),
                recruiterProfile.isProfileCompleted(),
                company,
                accountSetting
        );
    }

    private CompanyResponseDto mapToCompanyResponseDto(Company company) {
        return new CompanyResponseDto(
                company.getId(),
                company.getCompanyName(),
                company.getLogo(),
                company.getBanner(),
                company.getAbout(),
                company.getOrganizationType(),
                company.getIndustryType(),
                company.getTeamSize(),
                company.getYearOfEstablishment(),
                company.getWebsite(),
                company.getFacebook(),
                company.getTwitter(),
                company.getLinkedin(),
                company.getInstagram(),
                company.getPhone(),
                company.getEmail(),
                company.getAddress(),
                company.getCity(),
                company.getState(),
                company.getCountry(),
                company.getZipCode()
        );
    }

    private RecruiterAccountSettingResponseDto mapToAccountSettingResponseDto(RecruiterAccountSetting setting) {
        return new RecruiterAccountSettingResponseDto(
                setting.getId(),
                setting.isCompanyVisible(),
                setting.isApplicantEmailEnabled(),
                setting.isEmailNotificationEnabled()
        );
    }
}

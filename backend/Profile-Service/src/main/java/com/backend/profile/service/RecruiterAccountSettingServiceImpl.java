package com.backend.profile.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.daos.RecruiterAccountSettingRepository;
import com.backend.daos.RecruiterProfileRepository;
import com.backend.profile.dtos.RecruiterAccountSettingRequestDto;
import com.backend.profile.dtos.RecruiterAccountSettingResponseDto;
import com.backend.profile.entities.RecruiterAccountSetting;
import com.backend.profile.entities.RecruiterProfile;
import com.backend.profile.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RecruiterAccountSettingServiceImpl implements RecruiterAccountSettingService {

    private final RecruiterAccountSettingRepository recruiterAccountSettingRepository;

    private final RecruiterProfileRepository recruiterProfileRepository;

    @Override
    public RecruiterAccountSettingResponseDto updateAccountSettings(
            Long recruiterProfileId,
            RecruiterAccountSettingRequestDto dto
    ) {
        RecruiterAccountSetting setting = recruiterAccountSettingRepository
                .findByRecruiterId(recruiterProfileId)
                .orElseGet(() -> createAccountSetting(recruiterProfileId));

        setting.setCompanyVisible(dto.isCompanyVisible());
        setting.setApplicantEmailEnabled(dto.isApplicantEmailEnabled());
        setting.setEmailNotificationEnabled(dto.isEmailNotificationEnabled());

        RecruiterAccountSetting saved = recruiterAccountSettingRepository.save(setting);

        return mapToResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterAccountSettingResponseDto getAccountSettings(Long recruiterProfileId) {

        return recruiterAccountSettingRepository.findByRecruiterId(recruiterProfileId)
                .map(this::mapToResponseDto)
                .orElse(new RecruiterAccountSettingResponseDto(null, true, true, true));
    }

    private RecruiterAccountSetting createAccountSetting(Long recruiterProfileId) {
        RecruiterProfile recruiter = recruiterProfileRepository.findById(recruiterProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        RecruiterAccountSetting setting = new RecruiterAccountSetting();
        setting.setRecruiter(recruiter);
        return setting;
    }

    private RecruiterAccountSettingResponseDto mapToResponseDto(RecruiterAccountSetting setting) {
        return new RecruiterAccountSettingResponseDto(
                setting.getId(),
                setting.isCompanyVisible(),
                setting.isApplicantEmailEnabled(),
                setting.isEmailNotificationEnabled()
        );
    }
}

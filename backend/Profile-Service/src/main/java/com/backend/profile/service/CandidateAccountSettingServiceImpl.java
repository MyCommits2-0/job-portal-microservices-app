package com.backend.profile.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.daos.CandidateAccountSettingRepository;
import com.backend.daos.CandidateProfileRepository;
import com.backend.profile.dtos.CandidateAccountSettingRequestDto;
import com.backend.profile.dtos.CandidateAccountSettingResponseDto;
import com.backend.profile.entities.CandidateAccountSetting;
import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateAccountSettingServiceImpl implements CandidateAccountSettingService {

    private final CandidateAccountSettingRepository candidateAccountSettingRepository;

    private final CandidateProfileRepository candidateProfileRepository;

    @Override
    public CandidateAccountSettingResponseDto updateAccountSettings(
            Long candidateProfileId,
            CandidateAccountSettingRequestDto dto
    ) {
        CandidateAccountSetting setting = candidateAccountSettingRepository
                .findByCandidateId(candidateProfileId)
                .orElseGet(() -> createAccountSetting(candidateProfileId));

        setting.setProfileVisible(dto.isProfileVisible());
        setting.setJobAlertEnabled(dto.isJobAlertEnabled());
        setting.setEmailNotificationEnabled(dto.isEmailNotificationEnabled());

        CandidateAccountSetting saved = candidateAccountSettingRepository.save(setting);

        return mapToResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateAccountSettingResponseDto getAccountSettings(Long candidateProfileId) {

        return candidateAccountSettingRepository.findByCandidateId(candidateProfileId)
                .map(this::mapToResponseDto)
                // No settings saved yet - hand back the entity's own defaults rather than a 404,
                // since account settings only exist once the candidate has customized them.
                .orElse(new CandidateAccountSettingResponseDto(null, true, true, true));
    }

    private CandidateAccountSetting createAccountSetting(Long candidateProfileId) {
        CandidateProfile candidate = candidateProfileRepository.findById(candidateProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        CandidateAccountSetting setting = new CandidateAccountSetting();
        setting.setCandidate(candidate);
        return setting;
    }

    private CandidateAccountSettingResponseDto mapToResponseDto(CandidateAccountSetting setting) {
        return new CandidateAccountSettingResponseDto(
                setting.getId(),
                setting.isProfileVisible(),
                setting.isJobAlertEnabled(),
                setting.isEmailNotificationEnabled()
        );
    }
}

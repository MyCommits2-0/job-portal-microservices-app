package com.backend.profile.service;

import com.backend.profile.dtos.CandidateAccountSettingRequestDto;
import com.backend.profile.dtos.CandidateAccountSettingResponseDto;

public interface CandidateAccountSettingService {

    CandidateAccountSettingResponseDto updateAccountSettings(Long candidateProfileId, CandidateAccountSettingRequestDto dto);

    CandidateAccountSettingResponseDto getAccountSettings(Long candidateProfileId);
}

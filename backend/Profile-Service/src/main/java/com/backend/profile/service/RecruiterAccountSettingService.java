package com.backend.profile.service;

import com.backend.profile.dtos.RecruiterAccountSettingRequestDto;
import com.backend.profile.dtos.RecruiterAccountSettingResponseDto;

public interface RecruiterAccountSettingService {

    RecruiterAccountSettingResponseDto updateAccountSettings(Long recruiterProfileId, RecruiterAccountSettingRequestDto dto);

    RecruiterAccountSettingResponseDto getAccountSettings(Long recruiterProfileId);
}

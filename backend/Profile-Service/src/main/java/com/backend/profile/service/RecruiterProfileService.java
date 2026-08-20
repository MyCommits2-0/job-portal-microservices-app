package com.backend.profile.service;

import com.backend.profile.dtos.CreateRecruiterProfileRequestDto;
import com.backend.profile.dtos.CreateRecruiterProfileResponseDto;
import com.backend.profile.dtos.RecruiterPersonalInfoRequestDto;
import com.backend.profile.dtos.RecruiterPersonalInfoResponseDto;
import com.backend.profile.dtos.RecruiterProfileResponseDto;

public interface RecruiterProfileService {

    CreateRecruiterProfileResponseDto createRecruiterProfile(CreateRecruiterProfileRequestDto requestDto);

    RecruiterPersonalInfoResponseDto updatePersonalInfo(Long recruiterId, RecruiterPersonalInfoRequestDto requestDto);

    RecruiterProfileResponseDto getRecruiterProfile(Long recruiterId);
}

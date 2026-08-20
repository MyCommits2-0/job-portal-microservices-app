package com.backend.profile.service;
import com.backend.profile.dtos.CandidatePersonalInfoRequestDto;
import com.backend.profile.dtos.CandidatePersonalInfoResponseDto;
import com.backend.profile.dtos.CandidateProfileResponseDto;
import com.backend.profile.dtos.CreateCandidateProfileRequestDto;
import com.backend.profile.dtos.CreateCandidateProfileResponseDto;
import com.backend.profile.dtos.ApiResponse;

public interface CandidateProfileService {

	CreateCandidateProfileResponseDto createCandidateProfile(
            CreateCandidateProfileRequestDto requestDto
    );

	CandidatePersonalInfoResponseDto updatePersonalInfo(Long candidateId, CandidatePersonalInfoRequestDto requestDto);

	CandidateProfileResponseDto getCandidateProfile(Long candidateId);

}

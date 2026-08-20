package com.backend.profile.service;


import com.backend.profile.dtos.ExperienceRequestDto;
import com.backend.profile.dtos.ExperienceResponseDto;


public interface ExperienceService {

    ExperienceResponseDto addExperience(Long candidateProfileId,ExperienceRequestDto dto);

    void deleteExperience(Long candidateProfileId,Long experienceId);

}
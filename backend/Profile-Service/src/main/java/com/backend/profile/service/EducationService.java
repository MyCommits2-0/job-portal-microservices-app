package com.backend.profile.service;


import com.backend.profile.dtos.EducationRequestDto;
import com.backend.profile.dtos.EducationResponseDto;


public interface EducationService {


    EducationResponseDto addEducation(Long candidateProfileId,EducationRequestDto educationRequestDto);
    void deleteEducation(Long candidateProfileId,Long educationId);

}
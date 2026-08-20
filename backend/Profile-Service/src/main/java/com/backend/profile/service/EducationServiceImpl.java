package com.backend.profile.service;


import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.EducationRepository;
import com.backend.profile.dtos.EducationRequestDto;
import com.backend.profile.dtos.EducationResponseDto;
import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.Education;
import com.backend.profile.service.EducationService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
public class EducationServiceImpl implements EducationService {


    private final EducationRepository educationRepository;

    private final CandidateProfileRepository candidateProfileRepository;

    private final ModelMapper modelMapper;

    @Override
    public EducationResponseDto addEducation(Long candidateProfileId, EducationRequestDto dto) 
    {


        CandidateProfile candidate =candidateProfileRepository.findById(candidateProfileId).orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        Education education = modelMapper.map(dto, Education.class);
        education.setCandidate(candidate);
        Education savedEducation = educationRepository.save(education);

        return modelMapper.map(savedEducation,EducationResponseDto.class);

    }

    @Override
    public void deleteEducation(Long candidateProfileId,Long educationId)
    {


        Education education =educationRepository.findByIdAndCandidateId(educationId,candidateProfileId).orElseThrow(() -> new RuntimeException("Education not found for candidate"));

        educationRepository.delete(education);

    }

}
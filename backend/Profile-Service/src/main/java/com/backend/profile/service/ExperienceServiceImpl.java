package com.backend.profile.service;


import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.ExperienceRepository;

import com.backend.profile.dtos.ExperienceRequestDto;
import com.backend.profile.dtos.ExperienceResponseDto;

import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.Experience;

import com.backend.profile.service.ExperienceService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
@Transactional
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;

    private final CandidateProfileRepository candidateProfileRepository;

    private final ModelMapper modelMapper;

    @Override
    public ExperienceResponseDto addExperience( Long candidateProfileId, ExperienceRequestDto dto)
    {

        CandidateProfile candidate =candidateProfileRepository.findById(candidateProfileId).orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        Experience experience =modelMapper.map(dto,Experience.class);
        
        experience.setCandidate(candidate);

       Experience savedExperience = experienceRepository.save(experience);

       return modelMapper.map(savedExperience, ExperienceResponseDto.class);

    }




    @Override
    public void deleteExperience(
            Long candidateProfileId,
            Long experienceId
    ) {


        Experience experience =experienceRepository.findByIdAndCandidateId(experienceId,candidateProfileId).orElseThrow(() -> new RuntimeException("Experience not found for candidate"));

        experienceRepository.delete(experience);

    }

}
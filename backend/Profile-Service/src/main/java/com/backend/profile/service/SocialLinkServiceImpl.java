package com.backend.profile.service;


import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.CandidateSocialLinkRepository;

import com.backend.profile.dtos.SocialLinkRequestDto;
import com.backend.profile.dtos.SocialLinkResponseDto;

import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.CandidateSocialLink;

import com.backend.profile.service.SocialLinkService;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
public class SocialLinkServiceImpl 
        implements SocialLinkService {


    private final CandidateProfileRepository candidateProfileRepository;


    private final CandidateSocialLinkRepository socialLinkRepository;


    private final ModelMapper modelMapper;



    @Override
    public SocialLinkResponseDto addSocialLink( Long candidateProfileId, SocialLinkRequestDto dto)
    {

        CandidateProfile candidate =candidateProfileRepository.findById(candidateProfileId) .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        CandidateSocialLink socialLink = modelMapper.map( dto, CandidateSocialLink.class);

        socialLink.setCandidate(candidate);

        CandidateSocialLink saved = socialLinkRepository.save(socialLink);

        return modelMapper.map(saved,SocialLinkResponseDto.class);

    }


    @Override
    @Transactional(readOnly = true)
    public List<SocialLinkResponseDto> getSocialLinks(Long candidateProfileId)
    {


        return socialLinkRepository.findByCandidateId(candidateProfileId)
                .stream()
                .map(link -> modelMapper.map( link, SocialLinkResponseDto.class)).toList();

    }



    @Override
    public void deleteSocialLink( Long candidateProfileId,Long socialLinkId)
    {


        CandidateSocialLink link = socialLinkRepository.findByIdAndCandidateId(socialLinkId, candidateProfileId).orElseThrow( () -> new RuntimeException("Social link not found"));

        socialLinkRepository.delete(link);

    }

}
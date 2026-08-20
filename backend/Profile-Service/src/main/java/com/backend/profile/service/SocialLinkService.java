package com.backend.profile.service;

import java.util.List;

import com.backend.profile.dtos.SocialLinkRequestDto;
import com.backend.profile.dtos.SocialLinkResponseDto;
import com.backend.profile.entities.CandidateSocialLink;

public interface SocialLinkService {

	
	SocialLinkResponseDto addSocialLink(Long candidateProfileId,SocialLinkRequestDto dto);
	
	List<SocialLinkResponseDto>getSocialLinks(Long candidateProfileId);
	
	void deleteSocialLink(Long candidateProfileId,Long socialLinkId);
}

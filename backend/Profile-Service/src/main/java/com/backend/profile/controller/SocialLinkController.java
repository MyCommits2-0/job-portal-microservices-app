package com.backend.profile.controller;


import com.backend.profile.dtos.SocialLinkRequestDto;
import com.backend.profile.dtos.SocialLinkResponseDto;

import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.SocialLinkService;


import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class SocialLinkController {

    private final SocialLinkService socialLinkService;
    private final ProfileOwnershipGuard ownershipGuard;

    @PostMapping( "/candidates/{candidateProfileId}/social-links")
    public ResponseEntity<SocialLinkResponseDto> addSocialLink(@PathVariable Long candidateProfileId, @Valid @RequestBody SocialLinkRequestDto dto, @RequestHeader("X-User-Id") Long userId)
    {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        SocialLinkResponseDto response =socialLinkService.addSocialLink(candidateProfileId,dto);

    return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

    }




    @GetMapping( "/candidates/{candidateProfileId}/social-links")
    public ResponseEntity<List<SocialLinkResponseDto>> getSocialLinks(@PathVariable Long candidateProfileId, @RequestHeader("X-User-Id") Long userId )
    {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        return ResponseEntity.ok(
                socialLinkService.getSocialLinks(candidateProfileId)
        );

    }


    @DeleteMapping("/candidates/{candidateProfileId}/social-links/{socialLinkId}")
    public ResponseEntity<?> deleteSocialLink( @PathVariable Long candidateProfileId, @PathVariable Long socialLinkId, @RequestHeader("X-User-Id") Long userId)
    {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        socialLinkService.deleteSocialLink( candidateProfileId,socialLinkId );

       return ResponseEntity.ok(
                "Social link deleted successfully"
        );

    }

}
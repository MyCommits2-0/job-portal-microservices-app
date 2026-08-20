package com.backend.profile.controller;


import com.backend.profile.dtos.ExperienceRequestDto;
import com.backend.profile.dtos.ExperienceResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.ExperienceService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ExperienceController {



    private final ExperienceService experienceService;
    private final ProfileOwnershipGuard ownershipGuard;



    @PostMapping("/candidates/{candidateProfileId}/experience")
    public ResponseEntity<ExperienceResponseDto> addExperience( @PathVariable Long candidateProfileId, @Valid  @RequestBody ExperienceRequestDto dto, @RequestHeader("X-User-Id") Long userId)
    {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        ExperienceResponseDto response =experienceService.addExperience(candidateProfileId,dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @DeleteMapping( "/candidates/{candidateProfileId}/experience/{experienceId}")
    public ResponseEntity<?> deleteExperience( @PathVariable Long candidateProfileId, @PathVariable Long experienceId, @RequestHeader("X-User-Id") Long userId)
    {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        experienceService.deleteExperience(candidateProfileId,experienceId);

        return ResponseEntity.ok("Experience deleted successfully");

    }

}
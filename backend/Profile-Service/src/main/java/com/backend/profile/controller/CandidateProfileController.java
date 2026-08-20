package com.backend.profile.controller;

import com.backend.profile.dtos.CandidatePersonalInfoRequestDto;
import com.backend.profile.dtos.CandidatePersonalInfoResponseDto;
import com.backend.profile.dtos.CandidateProfileResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.CandidateProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/profile/candidates")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;
    private final ProfileOwnershipGuard ownershipGuard;

    @GetMapping("/{candidateId}")
    public ResponseEntity<CandidateProfileResponseDto> getCandidateProfile(
            @PathVariable Long candidateId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateId, userId);

        return ResponseEntity.ok(candidateProfileService.getCandidateProfile(candidateId));
    }

    @PutMapping(
            value = "/{candidateId}/personal-info",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<CandidatePersonalInfoResponseDto> updatePersonalInfo(
            @PathVariable Long candidateId,
            @Valid @ModelAttribute CandidatePersonalInfoRequestDto requestDto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateId, userId);

        CandidatePersonalInfoResponseDto response =
                candidateProfileService.updatePersonalInfo(candidateId, requestDto);

        return ResponseEntity.ok(response);
    }
}
package com.backend.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.CandidateAccountSettingRequestDto;
import com.backend.profile.dtos.CandidateAccountSettingResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.CandidateAccountSettingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class CandidateAccountSettingController {

    private final CandidateAccountSettingService candidateAccountSettingService;
    private final ProfileOwnershipGuard ownershipGuard;

    @GetMapping("/candidates/{candidateProfileId}/account-settings")
    public ResponseEntity<CandidateAccountSettingResponseDto> getAccountSettings(
            @PathVariable Long candidateProfileId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        return ResponseEntity.ok(candidateAccountSettingService.getAccountSettings(candidateProfileId));
    }

    @PutMapping("/candidates/{candidateProfileId}/account-settings")
    public ResponseEntity<CandidateAccountSettingResponseDto> updateAccountSettings(
            @PathVariable Long candidateProfileId,
            @Valid @RequestBody CandidateAccountSettingRequestDto dto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        return ResponseEntity.ok(
                candidateAccountSettingService.updateAccountSettings(candidateProfileId, dto)
        );
    }
}

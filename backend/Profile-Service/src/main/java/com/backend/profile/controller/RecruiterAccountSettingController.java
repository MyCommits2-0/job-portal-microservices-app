package com.backend.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.RecruiterAccountSettingRequestDto;
import com.backend.profile.dtos.RecruiterAccountSettingResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.RecruiterAccountSettingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile/recruiters")
@RequiredArgsConstructor
public class RecruiterAccountSettingController {

    private final RecruiterAccountSettingService recruiterAccountSettingService;
    private final ProfileOwnershipGuard ownershipGuard;

    @GetMapping("/{recruiterProfileId}/account-settings")
    public ResponseEntity<RecruiterAccountSettingResponseDto> getAccountSettings(
            @PathVariable Long recruiterProfileId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterProfileId, userId);

        return ResponseEntity.ok(recruiterAccountSettingService.getAccountSettings(recruiterProfileId));
    }

    @PutMapping("/{recruiterProfileId}/account-settings")
    public ResponseEntity<RecruiterAccountSettingResponseDto> updateAccountSettings(
            @PathVariable Long recruiterProfileId,
            @RequestBody RecruiterAccountSettingRequestDto dto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterProfileId, userId);

        return ResponseEntity.ok(
                recruiterAccountSettingService.updateAccountSettings(recruiterProfileId, dto)
        );
    }
}

package com.backend.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.RecruiterPersonalInfoRequestDto;
import com.backend.profile.dtos.RecruiterPersonalInfoResponseDto;
import com.backend.profile.dtos.RecruiterProfileResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.RecruiterProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile/recruiters")
@RequiredArgsConstructor
public class RecruiterProfileController {

    private final RecruiterProfileService recruiterProfileService;
    private final ProfileOwnershipGuard ownershipGuard;

    @GetMapping("/{recruiterId}")
    public ResponseEntity<RecruiterProfileResponseDto> getRecruiterProfile(
            @PathVariable Long recruiterId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterId, userId);

        return ResponseEntity.ok(recruiterProfileService.getRecruiterProfile(recruiterId));
    }

    @PutMapping("/{recruiterId}/personal-info")
    public ResponseEntity<RecruiterPersonalInfoResponseDto> updatePersonalInfo(
            @PathVariable Long recruiterId,
            @Valid @RequestBody RecruiterPersonalInfoRequestDto requestDto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterId, userId);

        RecruiterPersonalInfoResponseDto response =
                recruiterProfileService.updatePersonalInfo(recruiterId, requestDto);

        return ResponseEntity.ok(response);
    }
}

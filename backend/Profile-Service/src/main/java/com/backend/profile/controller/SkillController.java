package com.backend.profile.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.ApiResponse;
import com.backend.profile.dtos.SkillRequestDto;
import com.backend.profile.dtos.SkillResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.SkillService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;
    private final ProfileOwnershipGuard ownershipGuard;

    @PostMapping("/candidates/{candidateProfileId}/skills")
    public ResponseEntity<SkillResponseDto> addSkill(
            @PathVariable Long candidateProfileId,
            @Valid @RequestBody SkillRequestDto dto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        SkillResponseDto response = skillService.addSkill(candidateProfileId, dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/candidates/{candidateProfileId}/skills")
    public ResponseEntity<List<SkillResponseDto>> getSkills(
            @PathVariable Long candidateProfileId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        return ResponseEntity.ok(skillService.getSkills(candidateProfileId));
    }

    @DeleteMapping("/candidates/{candidateProfileId}/skills/{candidateSkillId}")
    public ResponseEntity<ApiResponse> deleteSkill(
            @PathVariable Long candidateProfileId,
            @PathVariable Long candidateSkillId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        skillService.deleteSkill(candidateProfileId, candidateSkillId);

        return ResponseEntity.ok(new ApiResponse("success", "Skill deleted successfully"));
    }
}

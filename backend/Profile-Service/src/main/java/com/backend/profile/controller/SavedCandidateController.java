package com.backend.profile.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.ApiResponse;
import com.backend.profile.dtos.SavedCandidateResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.SavedCandidateService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/profile/recruiters/{recruiterId}/saved-candidates")
@RequiredArgsConstructor
public class SavedCandidateController {

    private final SavedCandidateService savedCandidateService;
    private final ProfileOwnershipGuard ownershipGuard;

    @GetMapping
    public ResponseEntity<List<SavedCandidateResponseDto>> listSavedCandidates(
            @PathVariable Long recruiterId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterId, userId);

        return ResponseEntity.ok(savedCandidateService.listSavedCandidates(recruiterId));
    }

    @PostMapping("/{candidateUserId}")
    public ResponseEntity<ApiResponse> saveCandidate(
            @PathVariable Long recruiterId,
            @PathVariable Long candidateUserId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterId, userId);

        savedCandidateService.saveCandidate(recruiterId, candidateUserId);

        return ResponseEntity.ok(new ApiResponse("success", "Candidate saved successfully"));
    }

    @DeleteMapping("/{candidateUserId}")
    public ResponseEntity<ApiResponse> unsaveCandidate(
            @PathVariable Long recruiterId,
            @PathVariable Long candidateUserId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterId, userId);

        savedCandidateService.unsaveCandidate(recruiterId, candidateUserId);

        return ResponseEntity.ok(new ApiResponse("success", "Candidate removed from saved list"));
    }
}

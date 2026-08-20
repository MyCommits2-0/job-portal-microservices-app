package com.backend.profile.controller;

import com.backend.profile.dtos.ApiResponse;
import com.backend.profile.dtos.ResumeResponseDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final ProfileOwnershipGuard ownershipGuard;

    @GetMapping("/candidates/{candidateProfileId}/resumes")
    public ResponseEntity<List<ResumeResponseDto>> getCandidateResumes(
            @PathVariable Long candidateProfileId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        List<ResumeResponseDto> resumes =
                resumeService.getCandidateResumes(candidateProfileId);

        return ResponseEntity.ok(resumes);
    }

    @PostMapping(
            value = "/candidates/{candidateProfileId}/resumes",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResumeResponseDto> uploadResume(
            @PathVariable Long candidateProfileId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "defaultResume", defaultValue = "true") boolean defaultResume,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        ResumeResponseDto response =
                resumeService.uploadResume(candidateProfileId, file, defaultResume);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PatchMapping("/candidates/{candidateProfileId}/resumes/{resumeId}/default")
    public ResponseEntity<ResumeResponseDto> setDefaultResume(
            @PathVariable Long candidateProfileId,
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);

        return ResponseEntity.ok(resumeService.setDefaultResume(candidateProfileId, resumeId));
    }

    @DeleteMapping("/resumes/{resumeId}")
    public ResponseEntity<ApiResponse> deleteResume(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyResumeOwnership(resumeId, userId);

        resumeService.deleteResume(resumeId);

        return ResponseEntity.ok(new ApiResponse("success","Resume deleted successfully"));
    }
}
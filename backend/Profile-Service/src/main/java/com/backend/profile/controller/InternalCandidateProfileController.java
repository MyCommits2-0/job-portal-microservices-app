package com.backend.profile.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.CreateCandidateProfileRequestDto;
import com.backend.profile.dtos.CreateCandidateProfileResponseDto;
import com.backend.profile.dtos.ResumeResponseDto;
import com.backend.profile.service.CandidateProfileService;
import com.backend.profile.service.ResumeService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/profile/internal")
@RequiredArgsConstructor
public class InternalCandidateProfileController {

    private final CandidateProfileService candidateProfileService;

    private final ResumeService resumeService;

    @PostMapping("/candidates")
    public ResponseEntity<CreateCandidateProfileResponseDto> createCandidateProfile(
            @RequestBody CreateCandidateProfileRequestDto requestDto
    ) {
        CreateCandidateProfileResponseDto response =
                candidateProfileService.createCandidateProfile(requestDto);

        return ResponseEntity.ok(response);
    }

    /**
     * Used by Application-service to resolve a candidate's resumes from the
     * auth user id (the id carried in the gateway's X-User-Id header), since
     * downstream services never see the candidate's internal profile id.
     */
    @GetMapping("/candidates/by-user/{userId}/resumes")
    public ResponseEntity<List<ResumeResponseDto>> getResumesByUserId(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(resumeService.getResumesByUserId(userId));
    }
}
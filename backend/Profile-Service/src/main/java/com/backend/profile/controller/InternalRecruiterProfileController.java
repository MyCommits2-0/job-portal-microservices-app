package com.backend.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.CreateRecruiterProfileRequestDto;
import com.backend.profile.dtos.CreateRecruiterProfileResponseDto;
import com.backend.profile.service.RecruiterProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile/internal")
@RequiredArgsConstructor
public class InternalRecruiterProfileController {

    private final RecruiterProfileService recruiterProfileService;

    @PostMapping("/recruiters")
    public ResponseEntity<CreateRecruiterProfileResponseDto> createRecruiterProfile(
            @RequestBody CreateRecruiterProfileRequestDto requestDto
    ) {
        CreateRecruiterProfileResponseDto response =
                recruiterProfileService.createRecruiterProfile(requestDto);

        return ResponseEntity.ok(response);
    }
}

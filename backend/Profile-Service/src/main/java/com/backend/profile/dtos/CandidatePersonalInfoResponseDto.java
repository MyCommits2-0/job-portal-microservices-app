package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CandidatePersonalInfoResponseDto {

    private String status;

    private String message;

    private Long candidateProfileId;

    private String phone;

    private String profileTitle;

    private String location;

    private String bio;

    private String expectedSalary;

    private String experienceLevel;

    private String profileImageUrl;

    private Long resumeId;

    private String resumeFileName;

    private String resumeFileUrl;

    private boolean defaultResume;

    private String nextStep;
}
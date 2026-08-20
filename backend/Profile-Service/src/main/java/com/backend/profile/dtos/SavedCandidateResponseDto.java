package com.backend.profile.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavedCandidateResponseDto {

    private Long savedCandidateId;

    private Long candidateUserId;

    private String fullName;

    private String email;

    private String phone;

    private String profileTitle;

    private String location;

    private String bio;

    private String expectedSalary;

    private String experienceLevel;

    private String profileImageUrl;

    private LocalDateTime savedAt;
}

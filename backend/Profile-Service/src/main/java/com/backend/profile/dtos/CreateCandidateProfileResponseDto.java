package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CreateCandidateProfileResponseDto {

    private String status;

    private String message;

    private Long candidateProfileId;

    private Long userId;
}
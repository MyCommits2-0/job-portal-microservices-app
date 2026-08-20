package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecruiterPersonalInfoResponseDto {

    private String status;

    private String message;

    private Long recruiterProfileId;

    private String phone;

    private String designation;

    private String nextStep;
}

package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CreateRecruiterProfileResponseDto {

    private String status;

    private String message;

    private Long recruiterProfileId;

    private Long userId;
}

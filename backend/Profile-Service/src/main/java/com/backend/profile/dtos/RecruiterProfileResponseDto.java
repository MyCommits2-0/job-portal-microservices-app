package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecruiterProfileResponseDto {

    private Long id;

    private Long userId;

    private String phone;

    private String designation;

    private boolean profileCompleted;

    private CompanyResponseDto company;

    private RecruiterAccountSettingResponseDto accountSetting;
}

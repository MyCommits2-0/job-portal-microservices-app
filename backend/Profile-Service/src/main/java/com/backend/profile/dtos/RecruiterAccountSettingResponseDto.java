package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecruiterAccountSettingResponseDto {

    private Long id;

    private boolean companyVisible;

    private boolean applicantEmailEnabled;

    private boolean emailNotificationEnabled;
}

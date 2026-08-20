package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CandidateAccountSettingResponseDto {

    private Long id;

    private boolean profileVisible;

    private boolean jobAlertEnabled;

    private boolean emailNotificationEnabled;
}

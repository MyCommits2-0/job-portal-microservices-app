package com.backend.profile.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateAccountSettingRequestDto {

    private boolean profileVisible;

    private boolean jobAlertEnabled;

    private boolean emailNotificationEnabled;
}

package com.backend.profile.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecruiterAccountSettingRequestDto {

    private boolean companyVisible;

    private boolean applicantEmailEnabled;

    private boolean emailNotificationEnabled;
}

package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// Mirrors Jobs-service's own com.backend.jobs.dtos.CompanySummaryDto field-for-field -
// that's the contract InternalCompanyController's Feign response is deserialized into.
@Getter
@Setter
@AllArgsConstructor
public class CompanySummaryDto {

    private Long companyId;

    private String companyName;

    private String companyLogoUrl;

    private String companyIndustry;
}

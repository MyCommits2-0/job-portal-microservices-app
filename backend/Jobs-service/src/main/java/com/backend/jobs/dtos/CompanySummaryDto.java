package com.backend.jobs.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanySummaryDto {

    private Long companyId;

    private String companyName;

    private String companyLogoUrl;

    private String companyIndustry;
}
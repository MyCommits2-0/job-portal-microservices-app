package com.backend.jobs.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.backend.jobs.entities.JobLevel;
import com.backend.jobs.entities.JobStatus;
import com.backend.jobs.entities.JobType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobDetailsResponseDto {

    private Long id;

    private String title;

    private String tags;

    private String jobRole;

    private BigDecimal minSalary;

    private BigDecimal maxSalary;

    private String education;

    private String experience;

    private JobType jobType;

    private Integer vacancies;

    private LocalDate expirationDate;

    private JobLevel jobLevel;

    private String description;

    private String country;

    private String state;

    private String city;

    private Boolean remote;

    private JobStatus status;

    private Long viewsCount;

    private List<String> benefits;

    private LocalDateTime createdAt;

    // Company snapshot details
    private Long companyId;

    private String companyName;

    private String companyLogoUrl;

    private String companyIndustry;
}

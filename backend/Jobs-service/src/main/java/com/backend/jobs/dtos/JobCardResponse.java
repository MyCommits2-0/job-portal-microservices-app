package com.backend.jobs.dtos;

import java.math.BigDecimal;

import com.backend.jobs.entities.JobType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JobCardResponse {

    private Long id;              // needed for View Details / Apply / Save Job

    private String title;

    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    private String city;
    private String country;
    private String message;

    private Boolean remote;

    private JobType jobType;

    private String companyName;
    private String companyLogoUrl;
    
    public JobCardResponse(
            Long id,
            String title,
            BigDecimal minSalary,
            BigDecimal maxSalary,
            String city,
            String country,
            Boolean remote,
            JobType jobType,
            String companyName,
            String companyLogoUrl
    ) {
        this.id = id;
        this.title = title;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.city = city;
        this.country = country;
        this.remote = remote;
        this.jobType = jobType;
        this.companyName = companyName;
        this.companyLogoUrl = companyLogoUrl;
    }
}

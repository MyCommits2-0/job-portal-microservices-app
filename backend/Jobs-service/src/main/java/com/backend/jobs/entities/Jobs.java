package com.backend.jobs.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Jobs extends BaseEntity {

    /*
     * recruiterId comes from Auth/Profile Service.
     * Do not create Recruiter entity here.
     */
    @Column(name = "recruiter_id", nullable = false)
    private Long recruiterId;

    /*
     * companyId comes from Profile Service.
     * Do not create Company entity here.
     */
    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "job_role", length = 100)
    private String jobRole;

    @Column(name = "min_salary")
    private BigDecimal minSalary;

    @Column(name = "max_salary")
    private BigDecimal maxSalary;

    @Column(name = "education", length = 100)
    private String education;

    @Column(name = "experience", length = 100)
    private String experience;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", length = 30)
    private JobType jobType;

    @Column(name = "vacancies")
    private Integer vacancies;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_level", length = 30)
    private JobLevel jobLevel;

    @Column(name = "description", length = 5000)
    private String description;

    /*
     * Location is kept inside jobs table only.
     */
    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "is_remote")
    private Boolean remote = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private JobStatus status = JobStatus.ACTIVE;

    @ElementCollection
    @CollectionTable(
            name = "job_benefits",
            joinColumns = @JoinColumn(name = "job_id")
    )
    @Column(name = "benefit_name")
    private List<String> benefits = new ArrayList<>();
    
    //Company Snapshot
    @Column(name = "company_name", length = 200)
    private String companyName;

    @Column(name = "company_logo_url", length = 1000)
    private String companyLogoUrl;

    @Column(name = "company_industry", length = 100)
    private String companyIndustry;
}









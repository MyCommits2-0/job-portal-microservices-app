package com.backend.jobs.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.backend.jobs.entities.JobLevel;
import com.backend.jobs.entities.JobType;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateJobDto {

    @NotBlank(message = "Job title is required")
    private String title;

    private String tags;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotNull(message = "Minimum salary is required")
    @PositiveOrZero(message = "Minimum salary cannot be negative")
    private BigDecimal minSalary;

    @NotNull(message = "Maximum salary is required")
    @Positive(message = "Maximum salary must be positive")
    private BigDecimal maxSalary;

    @NotBlank(message = "Education is required")
    private String education;

    @NotBlank(message = "Experience is required")
    private String experience;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotNull(message = "Vacancies are required")
    @Min(value = 1, message = "Vacancies must be at least 1")
    private Integer vacancies;

    @NotNull(message = "Expiration date is required")
    @Future(message = "Expiration date must be in future")
    private LocalDate expirationDate;

    @NotNull(message = "Job level is required")
    private JobLevel jobLevel;

    @NotBlank(message = "Job description is required")
    private String description;

    private String country;

    private String state;

    private String city;

    private Boolean remote = false;

    private List<String> benefits;
}
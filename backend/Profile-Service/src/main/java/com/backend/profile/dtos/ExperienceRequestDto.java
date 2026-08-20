package com.backend.profile.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ExperienceRequestDto {


    @NotBlank(message = "Company name is required")
    private String companyName;


    @NotBlank(message = "Job title is required")
    private String jobTitle;


    @NotNull(message = "Start date is required")
    private LocalDate startDate;


    private LocalDate endDate;


    private String description;

}
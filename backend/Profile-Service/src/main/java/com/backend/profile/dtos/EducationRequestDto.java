package com.backend.profile.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EducationRequestDto {


    @NotBlank(message = "Degree is required")
    private String degree;


    @NotBlank(message = "Institute is required")
    private String institute;


    @NotBlank(message = "Passing year is required")
    private String passingYear;


    private String grade;
}
package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EducationResponseDto {


    private Long id;

    private String degree;

    private String institute;

    private String passingYear;

    private String grade;
}
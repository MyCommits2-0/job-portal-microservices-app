package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceResponseDto {


    private Long id;

    private String companyName;

    private String jobTitle;

    private String startDate;

    private String endDate;

    private String description;

}
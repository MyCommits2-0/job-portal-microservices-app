package com.backend.profile.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FoundingInfoRequestDto {

    private String organizationType;

    private String industryType;

    private String teamSize;

    private Integer yearOfEstablishment;

    private String website;
}

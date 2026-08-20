package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CompanyResponseDto {

    private Long id;

    private String companyName;

    private String logo;

    private String banner;

    private String about;

    private String organizationType;

    private String industryType;

    private String teamSize;

    private Integer yearOfEstablishment;

    private String website;

    private String facebook;

    private String twitter;

    private String linkedin;

    private String instagram;

    private String phone;

    private String email;

    private String address;

    private String city;

    private String state;

    private String country;

    private String zipCode;
}

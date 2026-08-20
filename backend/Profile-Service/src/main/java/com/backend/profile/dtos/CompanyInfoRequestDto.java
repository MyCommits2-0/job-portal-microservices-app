package com.backend.profile.dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanyInfoRequestDto {

    // Company.companyName is nullable=false in the entity — validate it here instead of
    // letting a blank submission fail deep in Hibernate/JDBC with a raw error.
    @NotBlank
    @Size(max = 150)
    private String companyName;

    private String about;

    private MultipartFile logo;

    private MultipartFile banner;
}

package com.backend.profile.dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CandidatePersonalInfoRequestDto {

    // Fields are optional (a candidate can save one section at a time), so only the max
    // length is enforced here — matching CandidateProfile's own @Column(length=...) limits,
    // so an oversized value is rejected with a clean 400 instead of failing in Hibernate/JDBC.
    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String profileTitle;

    @Size(max = 150)
    private String location;

    private String bio;

    @Size(max = 50)
    private String expectedSalary;

    @Size(max = 50)
    private String experienceLevel;

    private MultipartFile profileImage;

    private MultipartFile resume;

    private boolean defaultResume = true;
}
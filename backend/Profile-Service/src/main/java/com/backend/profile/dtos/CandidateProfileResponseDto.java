package com.backend.profile.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CandidateProfileResponseDto {

    private Long id;

    private Long userId;

    private String phone;

    private String profileTitle;

    private String profileImageUrl;

    private String location;

    private String bio;

    private String expectedSalary;

    private String experienceLevel;

    private boolean profileCompleted;

    private List<EducationResponseDto> educationList;

    private List<ExperienceResponseDto> experienceList;

    private List<SkillResponseDto> candidateSkills;

    private List<ResumeResponseDto> resumes;

    private List<SocialLinkResponseDto> socialLinks;

    private CandidateAccountSettingResponseDto accountSetting;
}

package com.backend.profile.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "candidate_profiles")
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"resumes", "educationList", "experienceList", "candidateSkills"})
public class CandidateProfile extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId; // From Auth Service

    @Column(length = 20)
    private String phone;

    @Column(name = "profile_title", length = 100)
    private String profileTitle;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "profile_image_public_id")
    private String profileImagePublicId;
    
    @Column(name = "profile_image_resource_type")
    private String profileImageResourceType;

    @Column(length = 150)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "expected_salary", length = 50)
    private String expectedSalary;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(name = "profile_completed")
    private boolean profileCompleted = false;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resume> resumes = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> educationList = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experienceList = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateSkill> candidateSkills = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateSocialLink> socialLinks = new ArrayList<>();

    @OneToOne(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private CandidateAccountSetting accountSetting;
}

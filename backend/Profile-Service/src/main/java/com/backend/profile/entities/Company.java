package com.backend.profile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "companies")
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "recruiter")
public class Company extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_profile_id", nullable = false, unique = true)
    private RecruiterProfile recruiter;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    private String logo;

    private String banner;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(name = "organization_type", length = 100)
    private String organizationType;

    @Column(name = "industry_type", length = 100)
    private String industryType;

    @Column(name = "team_size", length = 50)
    private String teamSize;

    @Column(name = "year_of_establishment")
    private Integer yearOfEstablishment;

    private String website;

    private String facebook;

    private String twitter;

    private String linkedin;

    private String instagram;

    @Column(length = 20)
    private String phone;

    @Column(length = 120)
    private String email;

    private String address;

    private String city;

    private String state;

    private String country;

    @Column(name = "zip_code", length = 20)
    private String zipCode;
}

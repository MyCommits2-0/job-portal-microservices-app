package com.backend.profile.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "recruiter_profiles")
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "company")
public class RecruiterProfile extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId; // Comes from Auth/User Service

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String designation;

    @Column(name = "is_profile_completed")
    private boolean profileCompleted = false;

    @OneToOne(mappedBy = "recruiter", cascade = CascadeType.ALL, orphanRemoval = true)
    private Company company;
}

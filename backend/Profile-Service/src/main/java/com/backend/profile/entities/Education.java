package com.backend.profile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "education")
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "candidate")
public class Education extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_profile_id", nullable = false)
    private CandidateProfile candidate;

    @Column(length = 100)
    private String degree;

    @Column(length = 150)
    private String institute;

    @Column(name = "passing_year", length = 20)
    private String passingYear;

    @Column(length = 50)
    private String grade;
}

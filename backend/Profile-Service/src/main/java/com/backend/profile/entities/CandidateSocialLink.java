package com.backend.profile.entities;

import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "candidate_social_links",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"candidate_profile_id", "platform"})
    }
)
@Getter
@Setter
@NoArgsConstructor
public class CandidateSocialLink extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_profile_id", nullable = false)
    private CandidateProfile candidate;

    @Column(nullable = false, length = 50)
    private String platform; // LINKEDIN, GITHUB, PORTFOLIO

    @Column(nullable = false)
    private String url;
}

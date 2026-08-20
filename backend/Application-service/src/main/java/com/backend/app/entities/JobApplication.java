package com.backend.app.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.backend.app.enums.ApplicationStatus;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "job_applications",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"job_id", "candidate_id"})
        }
)
@Getter
@Setter
public class JobApplication extends BaseEntity {

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "recruiter_id", nullable = false)
    private Long recruiterId;

    @Column(name = "resume_id")
    private Long resumeId;

    @Column(name = "job_title_snapshot")
    private String jobTitleSnapshot;

    @Column(name = "company_name_snapshot")
    private String companyNameSnapshot;

    @Column(name = "job_location_snapshot")
    private String jobLocationSnapshot;

    @Column(name = "min_salary_snapshot")
    private BigDecimal minSalarySnapshot;

    @Column(name = "max_salary_snapshot")
    private BigDecimal maxSalarySnapshot;

    @Column(name = "job_type_snapshot")
    private String jobTypeSnapshot;

    @Column(name = "note", length = 1000)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id")
    private ApplicationColumn column;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @PrePersist
    public void setAppliedAt() {
        if (appliedAt == null) {
            appliedAt = LocalDateTime.now();
        }
    }

}
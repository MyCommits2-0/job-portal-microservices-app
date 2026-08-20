package com.backend.app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.backend.app.enums.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDetailsResponse {

    private Long applicationId;

    private Long jobId;

    private Long candidateId;

    private String candidateName;

    private String candidateEmail;

    private Long recruiterId;

    private Long resumeId;

    private String resumeFileUrl;

    private String resumeFileName;

    private String jobTitleSnapshot;

    private String companyNameSnapshot;

    private String jobLocationSnapshot;

    private BigDecimal minSalarySnapshot;

    private BigDecimal maxSalarySnapshot;

    private String jobTypeSnapshot;

    private String note;

    private ApplicationStatus status;

    private LocalDateTime appliedAt;

}

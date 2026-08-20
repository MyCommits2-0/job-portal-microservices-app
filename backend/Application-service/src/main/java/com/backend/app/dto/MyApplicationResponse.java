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
public class MyApplicationResponse {

    private Long id;

    private Long jobId;

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

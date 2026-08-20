package com.backend.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CandidateApplicationDashboardCountsResponse {

    private long totalApplied;

    private long shortlisted;

    private long interview;

    private long hired;

    private long rejected;

    private long withdrawn;
}

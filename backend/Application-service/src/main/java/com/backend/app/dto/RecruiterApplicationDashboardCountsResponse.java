package com.backend.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecruiterApplicationDashboardCountsResponse {

    private long applications;
    private long shortlisted;
    private long hired;
}
package com.backend.jobs.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecruiterApplicationDashboardCountsResponse {

    private long applications;
    private long shortlisted;
    private long hired;
}
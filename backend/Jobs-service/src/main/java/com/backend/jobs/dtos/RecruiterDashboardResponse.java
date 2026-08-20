package com.backend.jobs.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RecruiterDashboardResponse {

    private long activeJobs;

    private long applications;

    private long shortlisted;

    private long hired;

    private List<RecruiterJobListResp> recentlyPostedJobs;
}
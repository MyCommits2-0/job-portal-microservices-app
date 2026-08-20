package com.backend.jobs.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.jobs.dtos.ApplicationCountResponse;
import com.backend.jobs.dtos.JobCardResponse;
import com.backend.jobs.dtos.JobIdsRequest;
import com.backend.jobs.dtos.RecruiterApplicationDashboardCountsResponse;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@FeignClient(
        name = "APPLICATION-SERVICE",
        path = "/internal/applications"
)
public interface ApplicationServiceClient {

    @PatchMapping("/jobs/{jobId}/deleted")
    void markApplicationsJobDeleted(
            @PathVariable("jobId") Long jobId
    );

    @GetMapping("/recruiter/{recruiterId}/dashboard-counts")
    RecruiterApplicationDashboardCountsResponse
            getRecruiterDashboardCounts(
                    @PathVariable("recruiterId") Long recruiterId
            );

    @GetMapping("/counts")
    List<ApplicationCountResponse> getApplicationCountsByJobIds(
            @RequestParam("jobIds") List<Long> jobIds
    );
    
    @PostMapping("/jobs/batch")
    List<JobCardResponse> getJobCardsByIds(@RequestBody JobIdsRequest request);
}
package com.backend.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.dto.RecruiterApplicationDashboardCountsResponse;
import com.backend.app.repository.JobApplicationRepository;
import com.backend.app.service.RecruiterDashboardService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/internal/applications")
public class InternalApplicationController {

    private final RecruiterDashboardService recruiterDashboardService;

    private final JobApplicationRepository applicationRepository;

    @GetMapping("/recruiter/{recruiterId}/dashboard-counts")
    public ResponseEntity<RecruiterApplicationDashboardCountsResponse>
            getRecruiterDashboardCounts(
                    @PathVariable Long recruiterId
            ) {

        RecruiterApplicationDashboardCountsResponse response =
                recruiterDashboardService.getDashboardCounts(
                        recruiterId
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/counts")
    public ResponseEntity<List<Map<String, Long>>>
            getApplicationCountsByJobIds(
                    @RequestParam List<Long> jobIds
            ) {

        if (jobIds == null || jobIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Map<String, Long>> response =
                applicationRepository
                        .countApplicationsByJobIds(jobIds)
                        .stream()
                        .map(result -> Map.of(
                                "jobId",
                                ((Number) result[0]).longValue(),
                                "applicationCount",
                                ((Number) result[1]).longValue()
                        ))
                        .toList();

        return ResponseEntity.ok(response);
    }
}
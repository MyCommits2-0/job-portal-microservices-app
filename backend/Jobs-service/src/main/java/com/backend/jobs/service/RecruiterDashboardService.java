package com.backend.jobs.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.jobs.client.ApplicationServiceClient;
import com.backend.jobs.dao.JobsDao;
import com.backend.jobs.dtos.ApplicationCountResponse;
import com.backend.jobs.dtos.RecruiterApplicationDashboardCountsResponse;
import com.backend.jobs.dtos.RecruiterDashboardResponse;
import com.backend.jobs.dtos.RecruiterJobListResp;
import com.backend.jobs.entities.JobStatus;
import com.backend.jobs.entities.Jobs;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class RecruiterDashboardService {

    private final JobsDao jobDao;

    private final ApplicationServiceClient applicationServiceClient;

    private final ModelMapper mapper;

    public RecruiterDashboardResponse getDashboardCounts(
            Long recruiterId,
            String role
    ) {
        if (!"RECRUITER".equalsIgnoreCase(role)) {
            throw new RuntimeException(
                    "Only recruiter can access dashboard counts"
            );
        }

        long activeJobs =
                jobDao.countByRecruiterIdAndStatus(
                        recruiterId,
                        JobStatus.ACTIVE
                );

        RecruiterApplicationDashboardCountsResponse applicationCounts =
                applicationServiceClient
                        .getRecruiterDashboardCounts(
                                recruiterId
                        );

        List<Jobs> recentJobs =
                jobDao.findTop5ByRecruiterIdOrderByCreatedAtDesc(
                        recruiterId
                );

        List<Long> recentJobIds = recentJobs.stream()
                .map(Jobs::getId)
                .toList();

        Map<Long, Long> applicationCountMap =
                new HashMap<>();

        if (!recentJobIds.isEmpty()) {
            List<ApplicationCountResponse> counts =
                    applicationServiceClient
                            .getApplicationCountsByJobIds(
                                    recentJobIds
                            );

            applicationCountMap = counts.stream()
                    .collect(
                            Collectors.toMap(
                                    ApplicationCountResponse::getJobId,
                                    ApplicationCountResponse
                                            ::getApplicationCount
                            )
                    );
        }

        Map<Long, Long> finalApplicationCountMap =
                applicationCountMap;

        List<RecruiterJobListResp> recentlyPostedJobs =
                recentJobs.stream()
                        .map(job -> {
                            RecruiterJobListResp response =
                                    mapper.map(
                                            job,
                                            RecruiterJobListResp.class
                                    );

                            response.setApplicationCount(
                                    finalApplicationCountMap
                                            .getOrDefault(
                                                    job.getId(),
                                                    0L
                                            )
                            );

                            return response;
                        })
                        .toList();

        return new RecruiterDashboardResponse(
                activeJobs,
                applicationCounts.getApplications(),
                applicationCounts.getShortlisted(),
                applicationCounts.getHired(),
                recentlyPostedJobs
        );
    }
}
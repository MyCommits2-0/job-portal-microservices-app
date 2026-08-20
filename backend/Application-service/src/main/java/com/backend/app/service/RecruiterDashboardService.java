package com.backend.app.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.dto.RecruiterApplicationDashboardCountsResponse;
import com.backend.app.enums.ApplicationStatus;
import com.backend.app.repository.JobApplicationRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class RecruiterDashboardService {

    private final JobApplicationRepository applicationRepository;

    public RecruiterApplicationDashboardCountsResponse getDashboardCounts(
            Long recruiterId
    ) {
        long applications =
                applicationRepository.countByRecruiterId(recruiterId);

        long shortlisted =
                applicationRepository.countByRecruiterIdAndStatus(
                        recruiterId,
                        ApplicationStatus.SHORTLISTED
                );

        long hired =
                applicationRepository.countByRecruiterIdAndStatus(
                        recruiterId,
                        ApplicationStatus.HIRED
                );

        return new RecruiterApplicationDashboardCountsResponse(
                applications,
                shortlisted,
                hired
        );
    }
}
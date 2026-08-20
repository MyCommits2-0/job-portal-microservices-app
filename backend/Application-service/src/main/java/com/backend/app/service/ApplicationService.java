package com.backend.app.service;

import java.util.List;

import com.backend.app.dto.ApplicationCardResponse;
import com.backend.app.dto.ApplicationDetailsResponse;
import com.backend.app.dto.ApplicationResponse;
import com.backend.app.dto.ApplicationStatusHistoryResponse;
import com.backend.app.dto.ApplyJobRequest;
import com.backend.app.dto.CandidateApplicationDashboardCountsResponse;
import com.backend.app.dto.MyApplicationResponse;
import com.backend.app.enums.ApplicationStatus;

public interface ApplicationService {

    ApplicationResponse applyJob(Long candidateId,
            Long jobId,
            ApplyJobRequest dto);

    List<MyApplicationResponse> getMyApplication(Long candidateId);

    ApplicationDetailsResponse getApplication(Long applicationId, Long requesterId, String role);

    ApplicationResponse withdrawApplication(Long applicationId, Long candidateId);

    ApplicationResponse updateApplicationStatus(
            Long applicationId, Long recruiterId, ApplicationStatus newStatus);

    List<ApplicationStatusHistoryResponse> getApplicationHistory(
            Long applicationId, Long requesterId, String role);

    CandidateApplicationDashboardCountsResponse getCandidateDashboardCounts(Long candidateId);

    List<ApplicationCardResponse> getApplicationsForJob(Long jobId, Long recruiterId);

}

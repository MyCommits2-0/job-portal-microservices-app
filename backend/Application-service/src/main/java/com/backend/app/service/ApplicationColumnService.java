package com.backend.app.service;

import java.util.List;

import com.backend.app.dto.ApplicationColumnRequest;
import com.backend.app.dto.ApplicationColumnResponse;
import com.backend.app.entities.ApplicationColumn;

public interface ApplicationColumnService {

    List<ApplicationColumnResponse> getColumns(Long jobId, Long recruiterId);

    // Entity (not DTO) for internal use by ApplicationServiceImpl.applyJob - a brand new
    // application needs to be placed on the board immediately, in the same "Applied"
    // column a recruiter would see after it lazily seeds on their first board visit.
    ApplicationColumn getOrCreateAppliedColumn(Long jobId, Long recruiterId);

    ApplicationColumnResponse createColumn(
            Long jobId, Long recruiterId, ApplicationColumnRequest request);

    ApplicationColumnResponse updateColumn(
            Long columnId, Long recruiterId, ApplicationColumnRequest request);

    void deleteColumn(Long columnId, Long recruiterId);

    void moveApplicationToColumn(
            Long applicationId, Long columnId, Long recruiterId);
}

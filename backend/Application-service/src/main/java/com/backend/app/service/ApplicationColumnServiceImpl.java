package com.backend.app.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.dto.ApplicationColumnRequest;
import com.backend.app.dto.ApplicationColumnResponse;
import com.backend.app.entities.ApplicationColumn;
import com.backend.app.entities.JobApplication;
import com.backend.app.exception.ColumnNotFoundException;
import com.backend.app.exception.ApplicationNotFoundException;
import com.backend.app.exception.InvalidApplicationStateException;
import com.backend.app.exception.UnauthorizedActionException;
import com.backend.app.repository.ApplicationColumnRepository;
import com.backend.app.repository.JobApplicationRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ApplicationColumnServiceImpl implements ApplicationColumnService {

    private static final String[] DEFAULT_COLUMN_NAMES = {
            "Applied", "Shortlisted", "Interview", "Hired", "Rejected"
    };

    private final ApplicationColumnRepository columnRepository;

    private final JobApplicationRepository applicationRepository;

    @Override
    public List<ApplicationColumnResponse> getColumns(Long jobId, Long recruiterId) {
        return ensureColumns(jobId, recruiterId).stream().map(this::mapToResponse).toList();
    }

    @Override
    public ApplicationColumn getOrCreateAppliedColumn(Long jobId, Long recruiterId) {

        List<ApplicationColumn> columns = ensureColumns(jobId, recruiterId);

        return columns.stream()
                .filter(column -> DEFAULT_COLUMN_NAMES[0].equals(column.getColumnName()))
                .findFirst()
                // Falls back to whichever column sorts first, in case a recruiter has since
                // renamed/reordered the seeded "Applied" column.
                .orElse(columns.get(0));
    }

    private List<ApplicationColumn> ensureColumns(Long jobId, Long recruiterId) {

        List<ApplicationColumn> columns =
                columnRepository.findByJobIdAndRecruiterIdOrderByDisplayOrderAsc(jobId, recruiterId);

        if (columns.isEmpty()) {
            columns = seedDefaultColumns(jobId, recruiterId);
        }

        return columns;
    }

    private List<ApplicationColumn> seedDefaultColumns(Long jobId, Long recruiterId) {

        List<ApplicationColumn> defaults = new java.util.ArrayList<>();

        for (int i = 0; i < DEFAULT_COLUMN_NAMES.length; i++) {
            ApplicationColumn column = new ApplicationColumn();
            column.setJobId(jobId);
            column.setRecruiterId(recruiterId);
            column.setColumnName(DEFAULT_COLUMN_NAMES[i]);
            column.setDisplayOrder(i);
            column.setDefaultColumn(true);
            defaults.add(column);
        }

        return columnRepository.saveAll(defaults);
    }

    @Override
    public ApplicationColumnResponse createColumn(
            Long jobId, Long recruiterId, ApplicationColumnRequest request) {

        List<ApplicationColumn> existing =
                columnRepository.findByJobIdAndRecruiterIdOrderByDisplayOrderAsc(jobId, recruiterId);

        if (existing.isEmpty()) {
            existing = seedDefaultColumns(jobId, recruiterId);
        }

        int nextOrder = request.getDisplayOrder() != null
                ? request.getDisplayOrder()
                : existing.stream().mapToInt(ApplicationColumn::getDisplayOrder).max().orElse(-1) + 1;

        ApplicationColumn column = new ApplicationColumn();
        column.setJobId(jobId);
        column.setRecruiterId(recruiterId);
        column.setColumnName(request.getColumnName());
        column.setDisplayOrder(nextOrder);
        column.setDefaultColumn(false);

        return mapToResponse(columnRepository.save(column));
    }

    @Override
    public ApplicationColumnResponse updateColumn(
            Long columnId, Long recruiterId, ApplicationColumnRequest request) {

        ApplicationColumn column = getOwnedColumn(columnId, recruiterId);

        if (request.getColumnName() != null && !request.getColumnName().isBlank()) {
            column.setColumnName(request.getColumnName());
        }

        if (request.getDisplayOrder() != null) {
            column.setDisplayOrder(request.getDisplayOrder());
        }

        return mapToResponse(columnRepository.save(column));
    }

    @Override
    public void deleteColumn(Long columnId, Long recruiterId) {

        ApplicationColumn column = getOwnedColumn(columnId, recruiterId);

        if (column.isDefaultColumn()) {
            throw new InvalidApplicationStateException("Default columns cannot be deleted");
        }

        List<JobApplication> applications =
                applicationRepository.findByColumn_Id(columnId);

        applications.forEach(application -> application.setColumn(null));
        applicationRepository.saveAll(applications);

        columnRepository.delete(column);
    }

    @Override
    public void moveApplicationToColumn(
            Long applicationId, Long columnId, Long recruiterId) {

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        if (!application.getRecruiterId().equals(recruiterId)) {
            throw new UnauthorizedActionException(
                    "You are not allowed to manage this application");
        }

        ApplicationColumn column = getOwnedColumn(columnId, recruiterId);

        if (!column.getJobId().equals(application.getJobId())) {
            throw new InvalidApplicationStateException(
                    "Column does not belong to the same job as this application");
        }

        application.setColumn(column);
        applicationRepository.save(application);
    }

    private ApplicationColumn getOwnedColumn(Long columnId, Long recruiterId) {

        ApplicationColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ColumnNotFoundException("Column not found"));

        if (!column.getRecruiterId().equals(recruiterId)) {
            throw new UnauthorizedActionException(
                    "You are not allowed to manage this column");
        }

        return column;
    }

    private ApplicationColumnResponse mapToResponse(ApplicationColumn column) {
        return new ApplicationColumnResponse(
                column.getId(),
                column.getJobId(),
                column.getRecruiterId(),
                column.getColumnName(),
                column.getDisplayOrder(),
                column.isDefaultColumn()
        );
    }
}

package com.backend.app.dto;

import java.time.LocalDateTime;

import com.backend.app.enums.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One card on the recruiter's application kanban board for a job.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCardResponse {

    private Long applicationId;

    private Long candidateId;

    private String candidateName;

    private Long resumeId;

    private String resumeFileUrl;

    private String resumeFileName;

    private String note;

    private ApplicationStatus status;

    private Long columnId;

    private LocalDateTime appliedAt;
}

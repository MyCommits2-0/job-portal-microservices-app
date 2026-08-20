package com.backend.app.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyJobRequest {

    /**
     * Optional. When omitted, Application-service resolves the candidate's
     * default resume via Profile-Service. When provided, it must belong to
     * the applying candidate.
     */
    private Long resumeId;

    @Size(max = 1000, message = "Note must be at most 1000 characters")
    private String note;

}

package com.backend.jobs.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.backend.jobs.entities.JobStatus;
import com.backend.jobs.entities.JobType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class RecruiterJobListResp {
	private Long id;
    private String title;
    private JobType jobType;
    private JobStatus status;
    private LocalDate expirationDate;
    private Long applicationCount;
    
    public RecruiterJobListResp(
            Long id,
            String title,
            JobType jobType,
            JobStatus status,
            LocalDate expirationDate
    ) {
        this.id = id;
        this.title = title;
        this.jobType = jobType;
        this.status = status;
        this.expirationDate = expirationDate;
    }
}

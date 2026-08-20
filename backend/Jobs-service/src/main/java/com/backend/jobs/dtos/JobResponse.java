package com.backend.jobs.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.backend.jobs.entities.JobStatus;
import com.backend.jobs.entities.JobType;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JobResponse {
	
	private String title;
	
	private Long id;
	 
    private String city;
    
    private String state;
    
    private String country;

    private Boolean remote;

    private JobType jobType;

    private JobStatus status;

    private LocalDate expirationDate;

    private LocalDateTime createdAt;

    private String message;
}

package com.backend.jobs.dtos;

import java.math.BigDecimal;

import com.backend.jobs.entities.JobStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JobInternalResponse {
	private Long jobId;
    private String title;
    private Long recruiterId;
    //private Long companyId;
    private String companyName;

    // Jobs entity has no single "location" column (see Jobs.city/state/country/remote) -
    // this is computed in JobsServiceImpl and must match the field name Application-service's
    // own JobInternalResponse copy deserializes the Feign response into.
    private String location;

    private JobStatus status;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String jobType;

    // Leaner projection used by JobsDao#findJobCardsByIds (JPQL "new" expressions require an
    // exact constructor match, so this can't reuse the @AllArgsConstructor above).
    public JobInternalResponse(Long jobId, String title, Long recruiterId, String companyName, String location, JobStatus status) {
        this.jobId = jobId;
        this.title = title;
        this.recruiterId = recruiterId;
        this.companyName = companyName;
        this.location = location;
        this.status = status;
    }
}

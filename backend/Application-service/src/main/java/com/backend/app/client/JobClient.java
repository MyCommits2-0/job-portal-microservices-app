package com.backend.app.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.backend.app.dto.JobInternalResponse;

@FeignClient(
        name = "JOB-SERVICE"
)
public interface JobClient {

    @GetMapping("/Internal/jobs/{jobId}")
    JobInternalResponse getJobById(@PathVariable Long jobId);

}

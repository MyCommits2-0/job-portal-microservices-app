package com.backend.jobs.client;

import com.backend.jobs.dtos.CompanySummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Use the exact spring.application.name of Profile Service
@FeignClient(name = "PROFILE-SERVICE", path = "/internal/companies")
public interface ProfileServiceClient {

    @GetMapping("/recruiter/{recruiterId}/summary")
    public CompanySummaryDto getCompanySummaryByRecruiterId(
            @PathVariable("recruiterId") Long recruiterId
    );
}

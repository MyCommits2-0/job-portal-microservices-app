package com.backend.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.profile.dtos.CompanySummaryDto;
import com.backend.profile.service.CompanyService;

import lombok.RequiredArgsConstructor;

// Server-to-server only (called by Jobs-service's ProfileServiceClient via Eureka, never
// through the API Gateway), so unlike InternalRecruiterProfileController this isn't mounted
// under /api/profile - that prefix only exists for the Gateway's frontend-facing routes.
@RestController
@RequestMapping("/internal/companies")
@RequiredArgsConstructor
public class InternalCompanyController {

    private final CompanyService companyService;

    @GetMapping("/recruiter/{recruiterId}/summary")
    public ResponseEntity<CompanySummaryDto> getCompanySummaryByRecruiterId(
            @PathVariable("recruiterId") Long recruiterId
    ) {
        return ResponseEntity.ok(companyService.getCompanySummaryByUserId(recruiterId));
    }
}

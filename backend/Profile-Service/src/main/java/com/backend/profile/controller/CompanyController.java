package com.backend.profile.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.profile.dtos.ApiResponse;
import com.backend.profile.dtos.CompanyInfoRequestDto;
import com.backend.profile.dtos.CompanyResponseDto;
import com.backend.profile.dtos.CompanySocialLinksRequestDto;
import com.backend.profile.dtos.FoundingInfoRequestDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.CompanyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile/recruiters")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final ProfileOwnershipGuard ownershipGuard;

    @GetMapping("/{recruiterProfileId}/company")
    public ResponseEntity<CompanyResponseDto> getCompany(
            @PathVariable Long recruiterProfileId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterProfileId, userId);

        return ResponseEntity.ok(companyService.getCompany(recruiterProfileId));
    }

    @PutMapping(
            value = "/{recruiterProfileId}/company/info",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<CompanyResponseDto> updateCompanyInfo(
            @PathVariable Long recruiterProfileId,
            @Valid @ModelAttribute CompanyInfoRequestDto dto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterProfileId, userId);

        return ResponseEntity.ok(companyService.updateCompanyInfo(recruiterProfileId, dto));
    }

    @PutMapping("/{recruiterProfileId}/company/founding-info")
    public ResponseEntity<CompanyResponseDto> updateFoundingInfo(
            @PathVariable Long recruiterProfileId,
            @RequestBody FoundingInfoRequestDto dto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterProfileId, userId);

        return ResponseEntity.ok(companyService.updateFoundingInfo(recruiterProfileId, dto));
    }

    @PutMapping("/{recruiterProfileId}/company/social-links")
    public ResponseEntity<CompanyResponseDto> updateSocialLinks(
            @PathVariable Long recruiterProfileId,
            @RequestBody CompanySocialLinksRequestDto dto,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterProfileId, userId);

        return ResponseEntity.ok(companyService.updateSocialLinks(recruiterProfileId, dto));
    }

    @DeleteMapping("/{recruiterProfileId}/company")
    public ResponseEntity<ApiResponse> deleteCompany(
            @PathVariable Long recruiterProfileId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        ownershipGuard.verifyRecruiterOwnership(recruiterProfileId, userId);

        companyService.deleteCompany(recruiterProfileId);

        return ResponseEntity.ok(new ApiResponse("success", "Company deleted successfully"));
    }
}

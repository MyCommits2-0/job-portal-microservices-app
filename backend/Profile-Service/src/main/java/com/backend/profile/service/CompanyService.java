package com.backend.profile.service;

import com.backend.profile.dtos.CompanyInfoRequestDto;
import com.backend.profile.dtos.CompanyResponseDto;
import com.backend.profile.dtos.CompanySocialLinksRequestDto;
import com.backend.profile.dtos.CompanySummaryDto;
import com.backend.profile.dtos.FoundingInfoRequestDto;

public interface CompanyService {

    CompanyResponseDto getCompany(Long recruiterProfileId);

    // userId is the Auth Service id (what Jobs-service's X-User-Id carries), not the
    // recruiterProfileId used by every other method here - see InternalCompanyController.
    CompanySummaryDto getCompanySummaryByUserId(Long userId);

    CompanyResponseDto updateCompanyInfo(Long recruiterProfileId, CompanyInfoRequestDto dto);

    CompanyResponseDto updateFoundingInfo(Long recruiterProfileId, FoundingInfoRequestDto dto);

    CompanyResponseDto updateSocialLinks(Long recruiterProfileId, CompanySocialLinksRequestDto dto);

    void deleteCompany(Long recruiterProfileId);
}

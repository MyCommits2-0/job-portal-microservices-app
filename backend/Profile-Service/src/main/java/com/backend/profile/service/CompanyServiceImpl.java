package com.backend.profile.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.backend.daos.CompanyRepository;
import com.backend.daos.RecruiterProfileRepository;
import com.backend.profile.dtos.CloudinaryUploadResponse;
import com.backend.profile.dtos.CompanyInfoRequestDto;
import com.backend.profile.dtos.CompanyResponseDto;
import com.backend.profile.dtos.CompanySocialLinksRequestDto;
import com.backend.profile.dtos.CompanySummaryDto;
import com.backend.profile.dtos.FoundingInfoRequestDto;
import com.backend.profile.entities.Company;
import com.backend.profile.entities.RecruiterProfile;
import com.backend.profile.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    private final RecruiterProfileRepository recruiterProfileRepository;

    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public CompanyResponseDto getCompany(Long recruiterProfileId) {

        Company company = companyRepository.findByRecruiterId(recruiterProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for recruiter"));

        return mapToResponseDto(company);
    }

    @Override
    public CompanyResponseDto updateCompanyInfo(Long recruiterProfileId, CompanyInfoRequestDto dto) {

        Company company = getOrCreateCompany(recruiterProfileId);

        company.setCompanyName(dto.getCompanyName());
        company.setAbout(dto.getAbout());

        if (hasFile(dto.getLogo())) {
            company.setLogo(uploadImage(dto.getLogo(), recruiterProfileId, "logo"));
        }

        if (hasFile(dto.getBanner())) {
            company.setBanner(uploadImage(dto.getBanner(), recruiterProfileId, "banner"));
        }

        return mapToResponseDto(companyRepository.save(company));
    }

    @Override
    public CompanyResponseDto updateFoundingInfo(Long recruiterProfileId, FoundingInfoRequestDto dto) {

        Company company = getOrCreateCompany(recruiterProfileId);

        company.setOrganizationType(dto.getOrganizationType());
        company.setIndustryType(dto.getIndustryType());
        company.setTeamSize(dto.getTeamSize());
        company.setYearOfEstablishment(dto.getYearOfEstablishment());
        company.setWebsite(dto.getWebsite());

        return mapToResponseDto(companyRepository.save(company));
    }

    @Override
    public CompanyResponseDto updateSocialLinks(Long recruiterProfileId, CompanySocialLinksRequestDto dto) {

        Company company = getOrCreateCompany(recruiterProfileId);

        company.setFacebook(dto.getFacebook());
        company.setTwitter(dto.getTwitter());
        company.setLinkedin(dto.getLinkedin());
        company.setInstagram(dto.getInstagram());

        return mapToResponseDto(companyRepository.save(company));
    }

    @Override
    @Transactional(readOnly = true)
    public CompanySummaryDto getCompanySummaryByUserId(Long userId) {

        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        Company company = companyRepository.findByRecruiterId(recruiter.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        return new CompanySummaryDto(
                company.getId(),
                company.getCompanyName(),
                company.getLogo(),
                company.getIndustryType()
        );
    }

    @Override
    public void deleteCompany(Long recruiterProfileId) {

        Company company = companyRepository.findByRecruiterId(recruiterProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for recruiter"));

        companyRepository.delete(company);
    }

    private Company getOrCreateCompany(Long recruiterProfileId) {
        return companyRepository.findByRecruiterId(recruiterProfileId)
                .orElseGet(() -> {
                    RecruiterProfile recruiter = recruiterProfileRepository.findById(recruiterProfileId)
                            .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

                    Company company = new Company();
                    company.setRecruiter(recruiter);
                    return company;
                });
    }

    private String uploadImage(MultipartFile file, Long recruiterProfileId, String label) {
        CloudinaryUploadResponse response = cloudinaryService.uploadImage(
                file,
                "job-portal/recruiters/" + recruiterProfileId + "/company/" + label
        );
        return response.getFileUrl();
    }

    private boolean hasFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }

    private CompanyResponseDto mapToResponseDto(Company company) {
        return new CompanyResponseDto(
                company.getId(),
                company.getCompanyName(),
                company.getLogo(),
                company.getBanner(),
                company.getAbout(),
                company.getOrganizationType(),
                company.getIndustryType(),
                company.getTeamSize(),
                company.getYearOfEstablishment(),
                company.getWebsite(),
                company.getFacebook(),
                company.getTwitter(),
                company.getLinkedin(),
                company.getInstagram(),
                company.getPhone(),
                company.getEmail(),
                company.getAddress(),
                company.getCity(),
                company.getState(),
                company.getCountry(),
                company.getZipCode()
        );
    }
}

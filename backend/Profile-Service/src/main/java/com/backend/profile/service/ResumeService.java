package com.backend.profile.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.backend.profile.dtos.ResumeResponseDto;

public interface ResumeService {

	List<ResumeResponseDto> getCandidateResumes(Long candidateProfileId);

	List<ResumeResponseDto> getResumesByUserId(Long userId);

	ResumeResponseDto uploadResume(Long candidateProfileId, MultipartFile file, boolean defaultResume);

	ResumeResponseDto setDefaultResume(Long candidateProfileId, Long resumeId);

    void deleteResume(Long resumeId);
}

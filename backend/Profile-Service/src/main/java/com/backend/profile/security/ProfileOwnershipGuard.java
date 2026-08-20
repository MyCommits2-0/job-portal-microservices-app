package com.backend.profile.security;

import org.springframework.stereotype.Component;

import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.RecruiterProfileRepository;
import com.backend.daos.ResumeRepository;
import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.RecruiterProfile;
import com.backend.profile.entities.Resume;
import com.backend.profile.exceptions.ResourceNotFoundException;
import com.backend.profile.exceptions.UnauthorizedActionException;

import lombok.RequiredArgsConstructor;

/**
 * The API Gateway validates the caller's JWT and forwards the resulting user id as the
 * X-User-Id header — this class is the one place that checks the path id a controller
 * received actually belongs to that header's user, before any service/business logic runs.
 * Without this, any authenticated user could read/edit another user's profile just by
 * changing the numeric id in the URL.
 */
@Component
@RequiredArgsConstructor
public class ProfileOwnershipGuard {

    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final ResumeRepository resumeRepository;

    public void verifyCandidateOwnership(Long candidateProfileId, Long requestUserId) {
        CandidateProfile candidate = candidateProfileRepository.findById(candidateProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        if (!candidate.getUserId().equals(requestUserId)) {
            throw new UnauthorizedActionException("You do not have access to this candidate profile");
        }
    }

    public void verifyRecruiterOwnership(Long recruiterProfileId, Long requestUserId) {
        RecruiterProfile recruiter = recruiterProfileRepository.findById(recruiterProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        if (!recruiter.getUserId().equals(requestUserId)) {
            throw new UnauthorizedActionException("You do not have access to this recruiter profile");
        }
    }

    public void verifyResumeOwnership(Long resumeId, Long requestUserId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        if (!resume.getCandidate().getUserId().equals(requestUserId)) {
            throw new UnauthorizedActionException("You do not have access to this resume");
        }
    }
}

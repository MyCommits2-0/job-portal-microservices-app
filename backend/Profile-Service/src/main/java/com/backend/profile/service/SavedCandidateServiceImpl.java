package com.backend.profile.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.daos.CandidateProfileRepository;
import com.backend.daos.RecruiterProfileRepository;
import com.backend.daos.SavedCandidateRepository;
import com.backend.profile.client.AuthServiceClient;
import com.backend.profile.dtos.SavedCandidateResponseDto;
import com.backend.profile.dtos.UserInternalResponse;
import com.backend.profile.entities.CandidateProfile;
import com.backend.profile.entities.RecruiterProfile;
import com.backend.profile.entities.SavedCandidate;
import com.backend.profile.exceptions.DuplicateResourceException;
import com.backend.profile.exceptions.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SavedCandidateServiceImpl implements SavedCandidateService {

    private final RecruiterProfileRepository recruiterProfileRepository;

    private final CandidateProfileRepository candidateProfileRepository;

    private final SavedCandidateRepository savedCandidateRepository;

    private final AuthServiceClient authServiceClient;

    @Override
    public void saveCandidate(Long recruiterProfileId, Long candidateUserId) {

        RecruiterProfile recruiter = recruiterProfileRepository.findById(recruiterProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        CandidateProfile candidate = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        if (savedCandidateRepository.existsByRecruiterIdAndCandidateId(recruiterProfileId, candidate.getId())) {
            throw new DuplicateResourceException("Candidate is already saved");
        }

        SavedCandidate savedCandidate = new SavedCandidate();
        savedCandidate.setRecruiter(recruiter);
        savedCandidate.setCandidate(candidate);

        savedCandidateRepository.save(savedCandidate);
    }

    @Override
    public void unsaveCandidate(Long recruiterProfileId, Long candidateUserId) {

        CandidateProfile candidate = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        SavedCandidate savedCandidate = savedCandidateRepository
                .findByRecruiterIdAndCandidateId(recruiterProfileId, candidate.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Saved candidate not found"));

        savedCandidateRepository.delete(savedCandidate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavedCandidateResponseDto> listSavedCandidates(Long recruiterProfileId) {

        List<SavedCandidate> savedCandidates =
                savedCandidateRepository.findByRecruiterIdWithCandidate(recruiterProfileId);

        if (savedCandidates.isEmpty()) {
            return List.of();
        }

        List<Long> userIds = savedCandidates.stream()
                .map(sc -> sc.getCandidate().getUserId())
                .toList();

        // One batch call for the whole list, not one Auth-Service lookup per candidate.
        Map<Long, UserInternalResponse> usersById = authServiceClient.getUsersByIds(userIds).stream()
                .collect(java.util.stream.Collectors.toMap(UserInternalResponse::getId, Function.identity()));

        return savedCandidates.stream()
                .map(sc -> {
                    CandidateProfile candidate = sc.getCandidate();
                    UserInternalResponse user = usersById.get(candidate.getUserId());

                    return new SavedCandidateResponseDto(
                            sc.getId(),
                            candidate.getUserId(),
                            user != null ? user.getFullName() : null,
                            user != null ? user.getEmail() : null,
                            candidate.getPhone(),
                            candidate.getProfileTitle(),
                            candidate.getLocation(),
                            candidate.getBio(),
                            candidate.getExpectedSalary(),
                            candidate.getExperienceLevel(),
                            candidate.getProfileImageUrl(),
                            sc.getCreatedAt()
                    );
                })
                .toList();
    }
}

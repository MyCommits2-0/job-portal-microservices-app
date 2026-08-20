package com.backend.profile.service;

import java.util.List;

import com.backend.profile.dtos.SavedCandidateResponseDto;

public interface SavedCandidateService {

    void saveCandidate(Long recruiterProfileId, Long candidateUserId);

    void unsaveCandidate(Long recruiterProfileId, Long candidateUserId);

    List<SavedCandidateResponseDto> listSavedCandidates(Long recruiterProfileId);
}

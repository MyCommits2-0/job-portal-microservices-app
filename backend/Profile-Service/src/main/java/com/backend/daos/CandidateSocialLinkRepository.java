package com.backend.daos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.profile.entities.CandidateSocialLink;

public interface CandidateSocialLinkRepository extends JpaRepository<CandidateSocialLink,Long> {
  
	List<CandidateSocialLink> findByCandidateId(Long candidateProfileId);
	Optional<CandidateSocialLink> findByIdAndCandidateId(Long socialLinkId,Long candidateProfileId);
}

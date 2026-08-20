package com.backend.daos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.profile.entities.CandidateProfile;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {

	
	Optional<CandidateProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}

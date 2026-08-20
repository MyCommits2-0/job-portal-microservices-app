package com.backend.daos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.profile.entities.RecruiterProfile;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {

	Optional<RecruiterProfile> findByUserId(Long userId);

	boolean existsByUserId(Long userId);
}

package com.backend.daos;

import com.backend.profile.entities.Education;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> 
{

    Optional<Education> findByIdAndCandidateId(Long educationId,Long candidateProfileId);
}
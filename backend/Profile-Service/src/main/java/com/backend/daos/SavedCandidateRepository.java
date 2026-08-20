package com.backend.daos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.profile.entities.SavedCandidate;

public interface SavedCandidateRepository extends JpaRepository<SavedCandidate, Long> {

	boolean existsByRecruiterIdAndCandidateId(Long recruiterProfileId, Long candidateProfileId);

	Optional<SavedCandidate> findByRecruiterIdAndCandidateId(Long recruiterProfileId, Long candidateProfileId);

	// Loads the related CandidateProfile in the same query instead of one lazy
	// SELECT per row, same pattern as CandidateSkillRepository.findByCandidateIdWithSkill.
	@Query("select sc from SavedCandidate sc join fetch sc.candidate where sc.recruiter.id = :recruiterProfileId order by sc.createdAt desc")
	List<SavedCandidate> findByRecruiterIdWithCandidate(@Param("recruiterProfileId") Long recruiterProfileId);
}

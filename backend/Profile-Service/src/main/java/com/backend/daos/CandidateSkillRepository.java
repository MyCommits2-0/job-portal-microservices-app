package com.backend.daos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.profile.entities.CandidateSkill;

public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, Long> {

	List<CandidateSkill> findByCandidateId(Long candidateProfileId);

	Optional<CandidateSkill> findByIdAndCandidateId(Long candidateSkillId, Long candidateProfileId);

	boolean existsByCandidateIdAndSkillId(Long candidateProfileId, Long skillId);

	// Loads the related Skill in the same query instead of one lazy SELECT per
	// CandidateSkill row (that per-row lazy load was the actual N+1 in getCandidateProfile).
	@Query("select cs from CandidateSkill cs join fetch cs.skill where cs.candidate.id = :candidateProfileId")
	List<CandidateSkill> findByCandidateIdWithSkill(@Param("candidateProfileId") Long candidateProfileId);
}

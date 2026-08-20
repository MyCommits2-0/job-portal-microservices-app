package com.backend.daos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.profile.entities.Resume;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
	  @Modifying
	  @Query("update Resume r set r.defaultResume = false where r.candidate.id = :candidateId")
	  void clearDefaultResume(@Param("candidateId") Long candidateId);


	  // for finding the resume with cloudinary public id
	  List<Resume> findByCandidateId(Long candidateProfileId);

	  Optional<Resume> findByIdAndCandidateId(Long resumeId, Long candidateProfileId);
}

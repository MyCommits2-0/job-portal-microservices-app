package com.backend.daos;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.profile.entities.Experience;

public interface ExperienceRepository extends JpaRepository<Experience,Long> {
 Optional<Experience> findByIdAndCandidateId(Long ExperienceId,Long CandidateId);
}

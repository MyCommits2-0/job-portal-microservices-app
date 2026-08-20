package com.backend.daos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.profile.entities.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {

	Optional<Skill> findByName(String name);
}

package com.backend.daos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.profile.entities.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

	Optional<Company> findByRecruiterId(Long recruiterProfileId);
}

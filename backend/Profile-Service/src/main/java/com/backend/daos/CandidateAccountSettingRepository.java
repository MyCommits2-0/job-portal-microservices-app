package com.backend.daos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.profile.entities.CandidateAccountSetting;

public interface CandidateAccountSettingRepository extends JpaRepository<CandidateAccountSetting, Long> {

	Optional<CandidateAccountSetting> findByCandidateId(Long candidateProfileId);
}

package com.backend.daos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.profile.entities.RecruiterAccountSetting;

public interface RecruiterAccountSettingRepository extends JpaRepository<RecruiterAccountSetting, Long> {

	Optional<RecruiterAccountSetting> findByRecruiterId(Long recruiterProfileId);
}

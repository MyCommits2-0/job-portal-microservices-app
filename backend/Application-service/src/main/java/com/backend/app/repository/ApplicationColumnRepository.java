package com.backend.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.app.entities.ApplicationColumn;

public interface ApplicationColumnRepository
        extends JpaRepository<ApplicationColumn, Long> {

    List<ApplicationColumn> findByJobIdAndRecruiterIdOrderByDisplayOrderAsc(
            Long jobId,
            Long recruiterId
    );

    boolean existsByJobIdAndRecruiterId(Long jobId, Long recruiterId);
}

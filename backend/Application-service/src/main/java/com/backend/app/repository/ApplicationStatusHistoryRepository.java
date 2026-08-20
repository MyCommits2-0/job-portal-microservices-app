package com.backend.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.app.entities.ApplicationStatusHistory;

public interface ApplicationStatusHistoryRepository
        extends JpaRepository<ApplicationStatusHistory, Long> {

    List<ApplicationStatusHistory> findByApplication_IdOrderByChangedAtAsc(
            Long applicationId
    );
}

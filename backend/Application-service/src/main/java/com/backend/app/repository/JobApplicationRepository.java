package com.backend.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.app.entities.JobApplication;
import com.backend.app.enums.ApplicationStatus;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    boolean existsByJobIdAndCandidateId(
            Long jobId,
            Long candidateId
    );

    List<JobApplication> findByCandidateIdOrderByAppliedAtDesc(
            Long candidateId
    );

    long countByRecruiterId(Long recruiterId);

    long countByRecruiterIdAndStatus(
            Long recruiterId,
            ApplicationStatus status
    );

    long countByCandidateId(Long candidateId);

    long countByCandidateIdAndStatus(
            Long candidateId,
            ApplicationStatus status
    );

    List<JobApplication> findByColumn_Id(Long columnId);

    List<JobApplication> findByJobIdAndRecruiterIdOrderByAppliedAtDesc(
            Long jobId,
            Long recruiterId
    );
    
    @Query("""
            SELECT application.jobId, COUNT(application.id)
            FROM JobApplication application
            WHERE application.jobId IN :jobIds
            GROUP BY application.jobId
            """)
    List<Object[]> countApplicationsByJobIds(
            @Param("jobIds") List<Long> jobIds
    );
}
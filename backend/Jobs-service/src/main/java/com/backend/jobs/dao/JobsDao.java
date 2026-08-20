package com.backend.jobs.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.jobs.dtos.JobCardResponse;
import com.backend.jobs.dtos.JobInternalResponse;
import com.backend.jobs.dtos.RecruiterJobListResp;
import com.backend.jobs.entities.*;

public interface JobsDao extends JpaRepository<Jobs, Long> {

    List<Jobs> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);

    List<Jobs> findByRecruiterIdAndStatusOrderByCreatedAtDesc(
            Long recruiterId,
            JobStatus status
    );

    long countByRecruiterIdAndStatus(
            Long recruiterId,
            JobStatus status
    );

    List<Jobs> findTop5ByRecruiterIdOrderByCreatedAtDesc(
            Long recruiterId
    );
    
	//Candidate
	@Query("""
		    SELECT new com.backend.jobs.dtos.JobCardResponse(
		        j.id,
		        j.title,
		        j.minSalary,
		        j.maxSalary,
		        j.city,
		        j.country,
		        j.remote,
		        j.jobType,
		        j.companyName,
		        j.companyLogoUrl
		    )
		    FROM Jobs j
		    WHERE j.status = :status
		    AND (j.expirationDate IS NULL OR j.expirationDate >= :today)
		    ORDER BY j.createdAt DESC, j.id DESC
		""")
		List<JobCardResponse> findCandidateHomeJobs(
		        @Param("status") JobStatus status,
		        @Param("today") LocalDate today,
		        Pageable pageable
		);
	
	
	@Query(
	        value = """
	            SELECT new com.backend.jobs.dtos.JobCardResponse(
	                j.id,
	                j.title,
	                j.minSalary,
	                j.maxSalary,
	                j.city,
	                j.country,
	                j.remote,
	                j.jobType,
	                j.companyName,
	                j.companyLogoUrl
	            )
	            FROM Jobs j
	            WHERE j.status = :status
	            AND (j.expirationDate IS NULL OR j.expirationDate >= :today)
	            AND (
	                :keyword IS NULL
	                OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
	                OR LOWER(j.jobRole) LIKE LOWER(CONCAT('%', :keyword, '%'))
	                OR LOWER(j.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))
	                OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
	            )
	            AND (:city IS NULL OR LOWER(j.city) = LOWER(:city))
	            AND (:country IS NULL OR LOWER(j.country) = LOWER(:country))
	            AND (:jobType IS NULL OR j.jobType = :jobType)
	            ORDER BY j.createdAt DESC, j.id DESC
	        """,
	        countQuery = """
	            SELECT COUNT(j)
	            FROM Jobs j
	            WHERE j.status = :status
	            AND (j.expirationDate IS NULL OR j.expirationDate >= :today)
	            AND (
	                :keyword IS NULL
	                OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
	                OR LOWER(j.jobRole) LIKE LOWER(CONCAT('%', :keyword, '%'))
	                OR LOWER(j.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))
	                OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
	            )
	            AND (:city IS NULL OR LOWER(j.city) = LOWER(:city))
	            AND (:country IS NULL OR LOWER(j.country) = LOWER(:country))
	            AND (:jobType IS NULL OR j.jobType = :jobType)
	        """
	)
	Page<JobCardResponse> searchJobs(
	        @Param("keyword") String keyword,
	        @Param("city") String city,
	        @Param("country") String country,
	        @Param("jobType") JobType jobType,
	        @Param("status") JobStatus status,
	        @Param("today") LocalDate today,
	        Pageable pageable
	);

	@Query("""
		    SELECT new com.backend.jobs.dtos.RecruiterJobListResp(
		        j.id,
		        j.title,
		        j.jobType,
		        j.status,
		        j.expirationDate
		    )
		    FROM Jobs j
		    WHERE j.recruiterId = :recruiterId
		    AND (:status IS NULL OR j.status = :status)
		    ORDER BY j.createdAt DESC, j.id DESC
		""")
		List<RecruiterJobListResp> findRecruiterJobList(
		        @Param("recruiterId") Long recruiterId,
		        @Param("status") JobStatus status
		);

	//Internal APIS Queries   (this is "JPQL constructor expression")
	@Query("""
	        SELECT new com.backend.jobs.dtos.JobInternalResponse(
	            j.id,
	            j.title,
	            j.recruiterId,
	            j.companyName,
	            CASE WHEN j.remote = true THEN 'Remote' ELSE CONCAT(j.city, ', ', j.state, ', ', j.country) END,
	            j.status
	        )
	        FROM Jobs j
	        WHERE j.id IN :jobIds
	        AND j.status = 'ACTIVE'
	        """)
	    List<JobInternalResponse> findJobCardsByIds(@Param("jobIds") List<Long> jobIds);
	
}

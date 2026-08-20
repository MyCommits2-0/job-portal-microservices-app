package com.backend.jobs.service;  

import com.backend.jobs.dtos.*;
import com.backend.jobs.entities.JobStatus;
import com.backend.jobs.entities.JobType;

import java.util.*;

public interface JobsService {
	
	JobDetailsResponseDto getCandidateJobDetails(Long jobId);
	 PageResponse<JobCardResponse> searchJobs(String keyword, String city, String country,JobType jobType, int page, int size);
	 List<JobCardResponse> getCandidateHomeJobs();

	 List<RecruiterJobListResp> getMyJobs(Long recruiterId, JobStatus status, String role);
	 JobResponse editMyJob(Long jobId, Long recruiterId ,CreateJobDto dto);
	 JobResponse getJobById(Long jobId, Long recruiterId, String role);
	 JobResponse postJob(Long recruiterId, String role, CreateJobDto dto);
	 JobResponse closeJob(Long jobId, Long recruiterId, String userRole);
	 void deleteJob(Long jobId, Long recruiterId, String userRole);
	 JobInternalResponse getJobInternalDetails(Long jobId);	 
	 public List<JobInternalResponse> getJobCardsByIds(List<Long> jobIds);
}
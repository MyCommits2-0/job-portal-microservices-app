package com.backend.jobs.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.jobs.client.ApplicationServiceClient;
import com.backend.jobs.client.ProfileServiceClient;
import com.backend.jobs.dao.*;
import com.backend.jobs.dtos.*;
import com.backend.jobs.entities.*;

import feign.FeignException;
import lombok.*;

@Service
@Transactional
@AllArgsConstructor
public class JobsServiceImpl implements JobsService{
	
	// Also powers the candidate Job Alerts feed (most-recent-first, self-capping: once more
	// than this many active jobs exist, the oldest simply falls out of the query results).
	private static final int HOME_JOBS_LIMIT = 20;
	
	private final JobsDao jobDao;
	private  final ModelMapper mapper;
	private final ProfileServiceClient profileServiceClient;
	private final ApplicationServiceClient applicationServiceClient;
	
	 
	//CANDIDATE API
	 @Override
	 public PageResponse<JobCardResponse> searchJobs(
	         String keyword,
	         String city,
	         String country,
	         JobType jobType,
	         int page,
	         int size
	 ) {
		//if "", " text " such comes we are making them null, "text" respectively.
	     keyword = normalize(keyword);
	     city = normalize(city);
	     country = normalize(country);

	     int pageNumber = Math.max(page, 0);
	     int pageSize = Math.min(Math.max(size, 1), 50);

	     PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

	     Page<JobCardResponse> jobsPage = jobDao.searchJobs(
	             keyword,
	             city,
	             country,
	             jobType,
	             JobStatus.ACTIVE,
	             LocalDate.now(),
	             pageRequest
	     );

	     return new PageResponse<>(
	             jobsPage.getContent(),
	             jobsPage.getNumber(),
	             jobsPage.getSize(),
	             jobsPage.getTotalElements(),
	             jobsPage.getTotalPages(),
	             jobsPage.hasNext(),
	             jobsPage.isLast()
	     );
	 }

	 private String normalize(String value) {
	     return value == null || value.trim().isEmpty()
	             ? null
	             : value.trim();
	 }
	 
	
	 
	public List<JobCardResponse> getCandidateHomeJobs(){
			 
		 return jobDao.findCandidateHomeJobs(
		            JobStatus.ACTIVE,
		            LocalDate.now(),
		            PageRequest.of(0, HOME_JOBS_LIMIT)
		    );
	 }
	 
	 @Override
	 public JobDetailsResponseDto getCandidateJobDetails(Long jobId) {

	     Jobs job = jobDao.findById(jobId)
	             .orElseThrow(() -> new RuntimeException("Job not found"));

	     if (!JobStatus.ACTIVE.equals(job.getStatus())) {
	         throw new RuntimeException("This job is no longer available");
	     }

	     if (job.getExpirationDate() != null
	             && job.getExpirationDate().isBefore(LocalDate.now())) {
	         throw new RuntimeException("This job has expired");
	     }

	     JobDetailsResponseDto response = mapper.map(job, JobDetailsResponseDto.class);
	     response.setBenefits(job.getBenefits());
	     return response;
	 }
	
	
	 
	 //RECRUITER APIS
	 //PostJob API - When recruiter post, it store that data from database along with company details snapshot by calling profile service API
	 @Override
	 public JobResponse postJob(Long recruiterId, String role, CreateJobDto dto) {

	     if (!"RECRUITER".equalsIgnoreCase(role)) {
	         throw new RuntimeException("Only recruiter can post a job");
	     }

	     if (dto.getMinSalary() != null && dto.getMaxSalary() != null
	             && dto.getMinSalary().compareTo(dto.getMaxSalary()) > 0) {
	         throw new RuntimeException("Minimum salary cannot be greater than maximum salary");
	     }

	     CompanySummaryDto companySummary;

	     try {
	         companySummary = profileServiceClient.getCompanySummaryByRecruiterId(recruiterId);
	     } catch (FeignException.NotFound ex) {
	         throw new RuntimeException("Company profile not found. Please complete company profile first.");
	     } catch (FeignException ex) {
	         throw new RuntimeException("Profile Service is currently unavailable. Please try again later.");
	     }

	     if (companySummary == null || companySummary.getCompanyId() == null) {
	         throw new RuntimeException("Company profile not found. Please complete company profile first.");
	     }

	     Jobs job = mapper.map(dto, Jobs.class);

	     job.setRecruiterId(recruiterId);

	     job.setCompanyId(companySummary.getCompanyId());
	     job.setCompanyName(companySummary.getCompanyName());
	     job.setCompanyLogoUrl(companySummary.getCompanyLogoUrl());
	     job.setCompanyIndustry(companySummary.getCompanyIndustry());

	     job.setStatus(JobStatus.ACTIVE);
	     if (job.getRemote() == null) {
	         job.setRemote(false);
	     }

	     if (job.getBenefits() == null) {
	         job.setBenefits(new ArrayList<>());
	     }

	     Jobs savedJob = jobDao.save(job);

	     JobResponse response = mapper.map(savedJob, JobResponse.class);
	     response.setMessage("Job posted successfully");

	     return response;
	 }
	
	 @Override
	 public List<RecruiterJobListResp> getMyJobs(
	         Long recruiterId,
	         JobStatus status,
	         String role
	 ) {
	     if (!"RECRUITER".equalsIgnoreCase(role)) {
	         throw new RuntimeException("Only recruiter can view jobs");
	     }

	     List<RecruiterJobListResp> jobs =
	             jobDao.findRecruiterJobList(recruiterId, status);

	     List<Long> jobIds = jobs.stream()
	             .map(job -> job.getId())
	             .toList();

	     Map<Long, Long> countMap = new HashMap<>();

	     if (!jobIds.isEmpty()) {
	         List<ApplicationCountResponse> counts =
	                 applicationServiceClient.getApplicationCountsByJobIds(jobIds);

	         countMap = counts.stream()
	                 .collect(Collectors.toMap(
	                         applicationCount -> applicationCount.getJobId(),
	                         applicationCount -> applicationCount.getApplicationCount()
	                 ));
	     }

	     Map<Long, Long> finalCountMap = countMap;

	     jobs.forEach(job -> {
	         Long applicationCount =
	                 finalCountMap.getOrDefault(job.getId(), 0L);

	         job.setApplicationCount(applicationCount);
	     });

	     return jobs;
	 }
	
	 //Incomplete
	public JobResponse editMyJob(Long jobId, Long recruiterId, CreateJobDto dto) {
		
		Jobs job = jobDao.findById(jobId).orElseThrow(()-> new RuntimeException());
		job = mapper.map(dto, Jobs.class);
		job.setRecruiterId(recruiterId);
		JobResponse postJobResp = mapper.map(job, JobResponse.class);
		return postJobResp;
	}
	
	public JobResponse getJobById(Long jobId, Long recruiterId, String role) {
		
		if (!"RECRUITER".equalsIgnoreCase(role)) {
	        throw new RuntimeException("Only recruiter can view this job");
	    }

	    Jobs job = jobDao.findById(jobId)
	            .orElseThrow(() -> new RuntimeException("Job not found"));

	    if (!job.getRecruiterId().equals(recruiterId)) {
	        throw new RuntimeException("You are not allowed to view this job");
	    }
	    
	    JobResponse response = mapper.map(job, JobResponse.class);
	    response.setMessage("Job details");

	    return response;
	}
	
	public JobResponse closeJob(Long jobId, Long recruiterId, String userRole) {
		
		if(!"RECRUITER".equalsIgnoreCase(userRole)) {
			throw new RuntimeException("Only recruiter can Close Job");
		}
		
		Jobs job = jobDao.findById(jobId)
					.orElseThrow(()->  new RuntimeException("Job not found"));
		
		if(!job.getRecruiterId().equals(recruiterId)) {
			throw new RuntimeException("You are Not Allowed to Edit this job ");
		}
		
		job.setStatus(JobStatus.CLOSED);
		
		JobResponse response = mapper.map(job, JobResponse.class);
		response.setMessage("Job Closed succesfully");
		return response;
		
		//I May need to call Application Service
	}
	
	@Override
	public void deleteJob(Long jobId, Long recruiterId, String role) {

	    if (!"RECRUITER".equalsIgnoreCase(role)) {
	        throw new RuntimeException("Only recruiter can delete job");
	    }

	    Jobs job = jobDao.findById(jobId)
	            .orElseThrow(() -> new RuntimeException("Job not found"));

	    if (!job.getRecruiterId().equals(recruiterId)) {
	        throw new RuntimeException("You are not allowed to delete this job");
	    }

	    job.setStatus(JobStatus.DELETED);

	    jobDao.save(job);

	    applicationServiceClient.markApplicationsJobDeleted(jobId);	
	    
	    }
	
	//INTERNAL APIS
	public JobInternalResponse getJobInternalDetails(Long jobId) {
		
		 Jobs job = jobDao.findById(jobId)
		            .orElseThrow(() -> new RuntimeException("Job not found"));
		 
		 JobInternalResponse response = mapper.map(job, JobInternalResponse.class);

	    // because entity field is id, but DTO field is jobId
	    response.setJobId(job.getId());

	    // custom calculated field
	    if (Boolean.TRUE.equals(job.getRemote())) {
	        response.setLocation("Remote");
	    } else {
	        response.setLocation(
	                job.getCity() + ", " + job.getState() + ", " + job.getCountry()
	        );
	    }

	    if (job.getJobType() != null) {
	        response.setJobType(job.getJobType().name());
	    }

	    return response;
	}
	
	
	public List<JobInternalResponse> getJobCardsByIds(List<Long> jobIds) {
        return jobDao.findJobCardsByIds(jobIds);
    }
	
}












package com.backend.jobs.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.jobs.dtos.*;
import com.backend.jobs.entities.JobStatus;
import com.backend.jobs.entities.JobType;
import com.backend.jobs.service.JobsService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/jobs")
public class JobsController {
	
	private final JobsService jobService;
	
	
	//Candidates API
	
	@GetMapping("/search")
	public ResponseEntity<?> searchJobs(
	        @RequestParam(required = false) String keyword,
	        @RequestParam(required = false) String city,
	        @RequestParam(required = false) String country,
	        @RequestParam(required = false) JobType jobType,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "15") int size
	) {
		PageResponse<JobCardResponse> response = jobService.searchJobs(
	            keyword,
	            city,
	            country,
	            jobType, 
	            page,
	            size
	    );
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/home")
	public ResponseEntity<?> getCandidateHomeJobs() {

	    List<JobCardResponse> response = jobService.getCandidateHomeJobs();

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/{jobId}")
	public ResponseEntity<JobDetailsResponseDto> getCandidateJobDetails(
	        @PathVariable Long jobId
	) {
	    JobDetailsResponseDto response = jobService.getCandidateJobDetails(jobId);

	    return ResponseEntity.ok(response);
	}
	
	
	//Recruiter Jobs API
	
	@GetMapping("/recruiter/my-jobs")
	public ResponseEntity<?> getMyJobs(@RequestHeader("X-User-Id") Long recruiterId, @RequestHeader("X-User-Role") String role, @RequestParam JobStatus status){
		
		return ResponseEntity.ok(jobService.getMyJobs(recruiterId, status, role));
	}
	
	
	@PostMapping("/recruiter")
    public ResponseEntity<JobResponse> createJob(
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody CreateJobDto dto
    ) {
        JobResponse response = jobService.postJob(recruiterId, role, dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
	
	@PutMapping("/recruiter/{jobId}")
	public ResponseEntity<?> editjob(
	        @PathVariable Long jobId,
	        @RequestHeader("X-User-Id") Long recruiterId,
	        @RequestHeader("X-User-Role") String role,
	        @RequestBody CreateJobDto dto){

	    return ResponseEntity.ok(jobService.editMyJob(jobId, recruiterId, dto));
	}
	
	@GetMapping("/recruiter/my-jobs/{jobId}")
	public ResponseEntity<?> getJobsById(@PathVariable Long jobId, @RequestHeader("X-User-Id") Long recruiterId, @RequestHeader("X-User-Role") String role){
		  
		return ResponseEntity.ok(jobService.getJobById(jobId, recruiterId, role));
	}
	
	@PatchMapping("/recruiter/{jobId}/close")
	public ResponseEntity<?> closeJob(
	        @PathVariable Long jobId,
	        @RequestHeader("X-User-Id") Long recruiterId,
	        @RequestHeader("X-User-Role") String userRole
	) {
	    return ResponseEntity.ok(
	            jobService.closeJob(jobId, recruiterId, userRole)
	    );
	}
	
	@DeleteMapping("/recruiter/{jobId}")
	public ResponseEntity<String> deleteJob(
	        @PathVariable Long jobId,
	        @RequestHeader("X-User-Id") Long recruiterId,
	        @RequestHeader("X-User-Role") String role
	) {
	    jobService.deleteJob(jobId, recruiterId, role);
	    return ResponseEntity.ok("Job deleted successfully");
	}
}














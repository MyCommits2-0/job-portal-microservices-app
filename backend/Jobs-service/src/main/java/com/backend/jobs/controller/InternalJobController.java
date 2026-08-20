package com.backend.jobs.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.backend.jobs.dtos.JobIdsRequest;
import com.backend.jobs.dtos.JobInternalResponse;
import com.backend.jobs.service.JobsService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/Internal")
public class InternalJobController {
	
	private final JobsService jobService;
	
	@GetMapping("/jobs/{jobId}")
	public ResponseEntity<?> getInternalJobDetails(@PathVariable Long jobId){
		
		return ResponseEntity.ok(jobService.getJobInternalDetails(jobId));
	}
	
    @PostMapping("/batch")
    public ResponseEntity<List<JobInternalResponse>> getJobCardsByIds(
            @RequestBody JobIdsRequest request) {

        List<JobInternalResponse> jobCards = jobService.getJobCardsByIds(request.getJobIds());
        return ResponseEntity.ok(jobCards);
    }
}

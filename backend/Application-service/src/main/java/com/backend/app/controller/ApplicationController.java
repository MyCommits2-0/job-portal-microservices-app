package com.backend.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.dto.ApplicationDetailsResponse;
import com.backend.app.dto.ApplicationStatusHistoryResponse;
import com.backend.app.dto.ApplyJobRequest;
import com.backend.app.dto.CandidateApplicationDashboardCountsResponse;
import com.backend.app.dto.UpdateApplicationStatusRequest;
import com.backend.app.exception.UnauthorizedActionException;
import com.backend.app.service.ApplicationService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

/**
 * candidateId/recruiterId are always read from the X-User-Id header, which is
 * only ever set by the API Gateway after it has validated the caller's JWT
 * (see ApiGateway's JwtAuthenticationFilter/GatewayRequestWrapper). Any such
 * header arriving directly from a browser/client is stripped by the gateway
 * before it reaches this service.
 */
@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<?> applyJob(
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long jobId,
            @Valid @RequestBody ApplyJobRequest dto) {

        requireRole(role, "CANDIDATE");

        return ResponseEntity.ok(
                applicationService.applyJob(candidateId, jobId, dto));
    }

    @GetMapping("/candidate/my-applications")
    public ResponseEntity<?> getapplications(
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestHeader("X-User-Role") String role) {

        requireRole(role, "CANDIDATE");

        return ResponseEntity.ok(applicationService.getMyApplication(candidateId));
    }

    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<?> getApplicationsForJob(
            @PathVariable Long jobId,
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role) {

        requireRole(role, "RECRUITER");

        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, recruiterId));
    }

    @GetMapping("/candidate/dashboard-counts")
    public ResponseEntity<CandidateApplicationDashboardCountsResponse> getCandidateDashboardCounts(
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestHeader("X-User-Role") String role) {

        requireRole(role, "CANDIDATE");

        return ResponseEntity.ok(applicationService.getCandidateDashboardCounts(candidateId));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationDetailsResponse> getApplication(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long requesterId,
            @RequestHeader("X-User-Role") String role) {

        return ResponseEntity.ok(applicationService.getApplication(applicationId, requesterId, role));
    }

    @GetMapping("/{applicationId}/history")
    public ResponseEntity<List<ApplicationStatusHistoryResponse>> getApplicationHistory(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long requesterId,
            @RequestHeader("X-User-Role") String role) {

        return ResponseEntity.ok(applicationService.getApplicationHistory(applicationId, requesterId, role));
    }

    @PatchMapping("/{applicationId}/withdraw")
    public ResponseEntity<?> withdrawApplication(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestHeader("X-User-Role") String role) {

        requireRole(role, "CANDIDATE");

        return ResponseEntity.ok(
                applicationService.withdrawApplication(applicationId, candidateId));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody UpdateApplicationStatusRequest dto) {

        requireRole(role, "RECRUITER");

        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(applicationId, recruiterId, dto.getStatus()));
    }

    private void requireRole(String role, String expected) {
        if (role == null || !role.equalsIgnoreCase(expected)) {
            throw new UnauthorizedActionException(
                    "Only a " + expected.toLowerCase() + " can perform this action");
        }
    }

}

package com.backend.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.dto.ApplicationColumnRequest;
import com.backend.app.dto.ApplicationColumnResponse;
import com.backend.app.dto.MoveApplicationColumnRequest;
import com.backend.app.exception.UnauthorizedActionException;
import com.backend.app.service.ApplicationColumnService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

/**
 * Recruiter-only kanban board for organizing applications on a job posting.
 * recruiterId always comes from the X-User-Id header set by the API Gateway.
 */
@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/applications")
public class ApplicationColumnController {

    private final ApplicationColumnService columnService;

    @GetMapping("/jobs/{jobId}/columns")
    public ResponseEntity<List<ApplicationColumnResponse>> getColumns(
            @PathVariable Long jobId,
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role) {

        requireRecruiter(role);

        return ResponseEntity.ok(columnService.getColumns(jobId, recruiterId));
    }

    @PostMapping("/jobs/{jobId}/columns")
    public ResponseEntity<ApplicationColumnResponse> createColumn(
            @PathVariable Long jobId,
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody ApplicationColumnRequest request) {

        requireRecruiter(role);

        return ResponseEntity.ok(columnService.createColumn(jobId, recruiterId, request));
    }

    @PatchMapping("/columns/{columnId}")
    public ResponseEntity<ApplicationColumnResponse> updateColumn(
            @PathVariable Long columnId,
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody ApplicationColumnRequest request) {

        requireRecruiter(role);

        return ResponseEntity.ok(columnService.updateColumn(columnId, recruiterId, request));
    }

    @DeleteMapping("/columns/{columnId}")
    public ResponseEntity<Void> deleteColumn(
            @PathVariable Long columnId,
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role) {

        requireRecruiter(role);

        columnService.deleteColumn(columnId, recruiterId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{applicationId}/column")
    public ResponseEntity<Void> moveApplicationToColumn(
            @PathVariable Long applicationId,
            @RequestHeader("X-User-Id") Long recruiterId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody MoveApplicationColumnRequest request) {

        requireRecruiter(role);

        columnService.moveApplicationToColumn(applicationId, request.getColumnId(), recruiterId);

        return ResponseEntity.noContent().build();
    }

    private void requireRecruiter(String role) {
        if (role == null || !role.equalsIgnoreCase("RECRUITER")) {
            throw new UnauthorizedActionException("Only a recruiter can perform this action");
        }
    }
}

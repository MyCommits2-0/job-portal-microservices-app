package com.backend.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.profile.dtos.EducationRequestDto;
import com.backend.profile.security.ProfileOwnershipGuard;
import com.backend.profile.service.EducationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/profile")
public class EducationController {
	private final EducationService educationService ;
	private final ProfileOwnershipGuard ownershipGuard;

	@PostMapping("/candidates/{candidateProfileId}/education")
	 public ResponseEntity<?> addEducation(@PathVariable  Long candidateProfileId, @Valid @RequestBody EducationRequestDto educationRequestDto, @RequestHeader("X-User-Id") Long userId )
	 {
		ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);
		return ResponseEntity.ok(educationService.addEducation(candidateProfileId,educationRequestDto));
	 }

	@DeleteMapping( "/candidates/{candidateProfileId}/education/{educationId}")
		public ResponseEntity<?> deleteEducation(@PathVariable Long candidateProfileId, @PathVariable Long educationId, @RequestHeader("X-User-Id") Long userId)
	{
		    ownershipGuard.verifyCandidateOwnership(candidateProfileId, userId);
		    educationService.deleteEducation(candidateProfileId,educationId);
		    return ResponseEntity.ok("Education deleted successfully");
		}
}

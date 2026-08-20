package com.cdac.controller;

<<<<<<< HEAD
=======
import java.util.List;

>>>>>>> feature/internal
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
<<<<<<< HEAD
=======
import org.springframework.web.bind.annotation.RequestParam;
>>>>>>> feature/internal
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dtos.UserResponseDto;
import com.cdac.service.AuthService;

import lombok.AllArgsConstructor;

/**
 * Called directly by other backend services (not through the API Gateway) to resolve
 * a userId into basic profile info - e.g. Application-service showing a candidate's
 * name on a recruiter's application view. Same trust model as Jobs-service's and
 * Profile-Service's own /internal/** endpoints.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/auth/internal")
public class InternalUserController {

    private final AuthService authService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.getCurrentUser(userId));
    }
<<<<<<< HEAD
=======

    // Used by Profile-Service to enrich a recruiter's saved-candidates list with
    // names/emails in one call instead of one lookup per candidate.
    @GetMapping("/users/batch")
    public ResponseEntity<List<UserResponseDto>> getUsers(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(authService.getUsersByIds(ids));
    }
>>>>>>> feature/internal
}

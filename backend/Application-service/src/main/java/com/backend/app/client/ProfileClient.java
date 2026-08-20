package com.backend.app.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.backend.app.dto.ResumeInternalResponse;

@FeignClient(
        name = "PROFILE-SERVICE"
)
public interface ProfileClient {

    @GetMapping("/api/profile/internal/candidates/by-user/{userId}/resumes")
    List<ResumeInternalResponse> getResumesByUserId(@PathVariable Long userId);
}

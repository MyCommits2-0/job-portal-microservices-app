package com.backend.app.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.backend.app.dto.UserInternalResponse;

@FeignClient(
        name = "AUTH-USER-SERVICE"
)
public interface AuthClient {

    @GetMapping("/auth/internal/users/{userId}")
    UserInternalResponse getUserById(@PathVariable Long userId);
}

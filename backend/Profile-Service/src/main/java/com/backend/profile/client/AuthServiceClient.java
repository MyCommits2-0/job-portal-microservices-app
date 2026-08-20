package com.backend.profile.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.profile.dtos.UserInternalResponse;

@FeignClient(
        name = "AUTH-USER-SERVICE"
)
public interface AuthServiceClient {

    @GetMapping("/auth/internal/users/batch")
    List<UserInternalResponse> getUsersByIds(@RequestParam("ids") List<Long> ids);
}

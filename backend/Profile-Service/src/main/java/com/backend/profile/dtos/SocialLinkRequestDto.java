package com.backend.profile.dtos;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SocialLinkRequestDto {


    @NotBlank(message = "Platform is required")
    private String platform;


    @NotBlank(message = "URL is required")
    private String url;

}
package com.backend.profile.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class SocialLinkResponseDto {


    private Long id;

    private String platform;

    private String url;

}
package com.cdac.dtos;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.cdac.entities.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {

    private String token;

    private String refreshToken;

    private Long userId;

    private String email;

    private Role role;

    private String message;
}

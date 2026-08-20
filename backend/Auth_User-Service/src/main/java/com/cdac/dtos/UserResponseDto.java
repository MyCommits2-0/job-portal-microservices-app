package com.cdac.dtos;

import com.cdac.entities.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long id;

    private String fullName;

    private String email;

    private Role role;

    private boolean emailVerified;

    private boolean active;
}

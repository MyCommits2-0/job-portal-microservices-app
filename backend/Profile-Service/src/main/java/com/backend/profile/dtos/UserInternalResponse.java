package com.backend.profile.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInternalResponse {

    private Long id;

    private String fullName;

    private String email;

    private String role;
}

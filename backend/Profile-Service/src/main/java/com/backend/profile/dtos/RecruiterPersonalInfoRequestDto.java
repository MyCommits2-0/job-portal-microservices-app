package com.backend.profile.dtos;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RecruiterPersonalInfoRequestDto {

    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String designation;
}

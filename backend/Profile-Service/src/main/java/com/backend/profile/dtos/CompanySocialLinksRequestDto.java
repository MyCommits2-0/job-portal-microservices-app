package com.backend.profile.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanySocialLinksRequestDto {

    private String facebook;

    private String twitter;

    private String linkedin;

    private String instagram;
}

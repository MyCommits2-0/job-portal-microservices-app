package com.backend.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeInternalResponse {

    private Long id;

    private String fileName;

    private String fileUrl;

    private String cloudinaryPublicId;

    private String resourceType;

    private boolean defaultResume;
}

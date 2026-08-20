package com.backend.profile.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CloudinaryUploadResponse {

    private String originalFileName;
    
    private String fileUrl;
    
    private String publicId;
    
    private String resourceType;
}

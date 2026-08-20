package com.backend.profile.service;

import com.backend.profile.dtos.CloudinaryUploadResponse;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryUploadResponse uploadResume(MultipartFile file, Long candidateProfileId) {
        validateResume(file);

        try {
            String originalFileName = file.getOriginalFilename();

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                    		 "folder",
                    		    "job-portal/candidates/" + candidateProfileId + "/resumes",
                    		    "resource_type",
                    		    "raw",
                    		    "type",
                    		    "upload",
                    		    "public_id",
                    		    originalFileName
                    )
            );

            return new CloudinaryUploadResponse(
                    originalFileName,
                    uploadResult.get("secure_url").toString(),
                    uploadResult.get("public_id").toString(),
                    uploadResult.get("resource_type").toString()
            );

        } catch (Exception e) {
            e.printStackTrace();   
            throw new RuntimeException("Failed to upload resume to Cloudinary", e);
        }
    }

    public CloudinaryUploadResponse uploadImage(MultipartFile file, String folder) {
        validateImage(file);

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image"
                    )
            );

            return new CloudinaryUploadResponse(
                    file.getOriginalFilename(),
                    uploadResult.get("secure_url").toString(),
                    uploadResult.get("public_id").toString(),
                    uploadResult.get("resource_type").toString()
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    public void deleteFile(String publicId, String resourceType) {
        try {
            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", resourceType)
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from Cloudinary", e);
        }
    }

    private void validateResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume file is required");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("application/pdf")
                        || contentType.equals("application/msword")
                        || contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
            throw new RuntimeException("Only PDF, DOC, and DOCX resumes are allowed");
        }

        long maxSize = 5 * 1024 * 1024;

        if (file.getSize() > maxSize) {
            throw new RuntimeException("Resume size must be less than 5MB");
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Image file is required");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/jpeg")
                        || contentType.equals("image/png")
                        || contentType.equals("image/webp"))) {
            throw new RuntimeException("Only JPG, PNG, and WEBP images are allowed");
        }

        long maxSize = 2 * 1024 * 1024;

        if (file.getSize() > maxSize) {
            throw new RuntimeException("Image size must be less than 2MB");
        }
    }
}
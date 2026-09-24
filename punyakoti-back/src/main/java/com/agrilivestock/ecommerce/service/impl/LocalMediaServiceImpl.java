package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.exception.MediaUploadException;
import com.agrilivestock.ecommerce.service.MediaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class LocalMediaServiceImpl implements MediaService {

    @Value("${app.media.local.base-path:uploads}")
    private String basePath;

    @Value("${app.media.local.public-url:http://localhost:8080/media}")
    private String publicUrl;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new MediaUploadException("Failed to store empty file");
        }

        try {
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String filename = UUID.randomUUID() + extension;
            Path uploadDir = Paths.get(basePath, folder);
            File dir = uploadDir.toFile();
            if (!dir.exists()) {
                dir.mkdirs();
            }

            Path destination = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            log.info("Successfully uploaded file {} to {}", filename, destination);
            return publicUrl + "/" + folder + "/" + filename;
        } catch (IOException e) {
            log.error("Error uploading file", e);
            throw new MediaUploadException("Failed to store file: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith(publicUrl)) {
            return;
        }

        try {
            String relativePath = fileUrl.substring(publicUrl.length() + 1);
            Path filePath = Paths.get(basePath, relativePath);
            Files.deleteIfExists(filePath);
            log.info("Deleted file {}", filePath);
        } catch (IOException e) {
            log.warn("Failed to delete file from disk: {}", fileUrl, e);
        }
    }
}

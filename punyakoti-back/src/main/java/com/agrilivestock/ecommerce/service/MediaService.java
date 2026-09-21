package com.agrilivestock.ecommerce.service;

import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
    String uploadFile(MultipartFile file, String folder);
    void deleteFile(String fileUrl);
}

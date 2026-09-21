package com.agrilivestock.ecommerce.config.properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.media.local.base-path:uploads}")
    private String basePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = java.nio.file.Paths.get(basePath).toAbsolutePath().normalize().toString().replace("\\", "/");
        if (!uploadPath.endsWith("/")) {
            uploadPath += "/";
        }
        registry.addResourceHandler("/media/**")
                .addResourceLocations("file:" + uploadPath);
    }
}

package com.its.domovenok.core.config;

import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Список разрешённых origins для CORS. По умолчанию — localhost (разные порты/127.0.0.1) и GitHub Pages.
 * Переопределение: переменная окружения {@code CORS_ALLOWED_ORIGINS} (через запятую).
 */
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    private List<String> allowedOrigins = new ArrayList<>();

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
}

package com.its.domovenok.core.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS для {@code /api/**}: и фильтр (ранний порядок), и {@link WebMvcConfigurer} (на случай если preflight
 * обрабатывается только в DispatcherServlet).
 * <p>
 * Токен сессии передаётся в {@code Authorization}, cookies не используются — {@code allowCredentials(false)}.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final CorsProperties corsProperties;

    /** Если задано — полностью заменяет список из application.yml (через запятую). */
    @Value("${CORS_ALLOWED_ORIGINS:}")
    private String corsAllowedOriginsEnv;

    public WebConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        CorsConfiguration config = buildCorsConfiguration();
        String[] patterns = config.getAllowedOriginPatterns().toArray(new String[0]);
        registry.addMapping("/api/**")
                .allowedOriginPatterns(patterns)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .allowCredentials(config.getAllowCredentials())
                .maxAge(3600);
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", buildCorsConfiguration());
        CorsFilter filter = new CorsFilter(source);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(filter);
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    private CorsConfiguration buildCorsConfiguration() {
        List<String> origins = resolveAllowedOrigins();
        CorsConfiguration config = new CorsConfiguration();
        // Bearer в заголовке; без cookie — проще для браузера (не требуется credentialed CORS).
        config.setAllowCredentials(false);
        if (origins.isEmpty()) {
            config.addAllowedOriginPattern("*");
        } else {
            config.setAllowedOriginPatterns(origins);
        }
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(3600L);
        return config;
    }

    private List<String> resolveAllowedOrigins() {
        if (StringUtils.hasText(corsAllowedOriginsEnv)) {
            return Arrays.stream(corsAllowedOriginsEnv.split(","))
                    .map(String::trim)
                    .filter(StringUtils::hasText)
                    .toList();
        }
        List<String> fromYaml = corsProperties.getAllowedOrigins();
        if (fromYaml != null && !fromYaml.isEmpty()) {
            return fromYaml;
        }
        return List.of();
    }
}

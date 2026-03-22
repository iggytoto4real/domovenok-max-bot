package com.its.domovenok.core;

import com.its.domovenok.core.config.CorsProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(CorsProperties.class)
public class DomovenokCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(DomovenokCoreApplication.class, args);
    }
}

package com.its.domovenok.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DomovenokCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(DomovenokCoreApplication.class, args);
    }
}

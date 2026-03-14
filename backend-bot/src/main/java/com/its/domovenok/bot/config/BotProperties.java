package com.its.domovenok.bot.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "domovenok.max.bot")
@Getter
@Setter
public class BotProperties {

    private String token = "";
    private String apiBaseUrl = "https://platform-api.max.ru";
}

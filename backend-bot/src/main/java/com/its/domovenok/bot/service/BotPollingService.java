package com.its.domovenok.bot.service;

import com.its.domovenok.bot.client.MaxBotClient;
import com.its.domovenok.bot.config.BotProperties;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Long polling: в фоне запрашивает GET /updates и передаёт апдейты в BotUpdateHandler.
 * Работает с локали — исходящие запросы к platform-api.max.ru, входящий URL не нужен.
 */
@Service
public class BotPollingService {

    private static final Logger log = LoggerFactory.getLogger(BotPollingService.class);
    private static final int POLL_TIMEOUT_SECONDS = 30;
    private static final int MAX_UPDATES_PER_REQUEST = 100;

    private final BotProperties props;
    private final MaxBotClient botClient;
    private final BotUpdateHandler updateHandler;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private volatile Thread pollingThread;

    public BotPollingService(BotProperties props, MaxBotClient botClient, BotUpdateHandler updateHandler) {
        this.props = props;
        this.botClient = botClient;
        this.updateHandler = updateHandler;
    }

    @PostConstruct
    public void start() {
        if (props.getToken() == null || props.getToken().isBlank()) {
            log.warn("MAX bot token not set (domovenok.max.bot.token). Long polling disabled.");
            return;
        }
        running.set(true);
        pollingThread = new Thread(this::pollLoop, "max-bot-polling");
        pollingThread.setDaemon(false);
        pollingThread.start();
        log.info("MAX bot long polling started.");
    }

    @PreDestroy
    public void stop() {
        running.set(false);
        if (pollingThread != null) {
            pollingThread.interrupt();
        }
        log.info("MAX bot long polling stopped.");
    }

    private void pollLoop() {
        String marker = null;
        while (running.get()) {
            try {
                var result = botClient.getUpdates(MAX_UPDATES_PER_REQUEST, POLL_TIMEOUT_SECONDS, marker);
                for (var update : result.updates()) {
                    updateHandler.handleUpdate(update);
                }
                if (result.marker() != null && !result.marker().isBlank()) {
                    marker = result.marker();
                }
            } catch (Exception e) {
                log.warn("Poll error: {}", e.getMessage());
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }
}

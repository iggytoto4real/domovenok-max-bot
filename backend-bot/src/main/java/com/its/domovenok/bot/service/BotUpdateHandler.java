package com.its.domovenok.bot.service;

import com.its.domovenok.bot.client.MaxBotClient;
import com.its.domovenok.bot.dto.MessageDto;
import com.its.domovenok.bot.dto.UpdateDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Обрабатывает апдейты от MAX: извлекает user_id и текст, на /start отвечает приветствием.
 */
@Service
public class BotUpdateHandler {

    private static final Logger log = LoggerFactory.getLogger(BotUpdateHandler.class);
    private static final String WELCOME_TEXT =
            "Привет! Нажми кнопку «Играть», чтобы открыть своих домовят.\n\n"
                    + "Канал с новостями разработки: https://max.ru/id246009594706_biz";

    private final MaxBotClient botClient;

    public BotUpdateHandler(MaxBotClient botClient) {
        this.botClient = botClient;
    }

    public void handleUpdate(UpdateDto update) {
        try {
            String text = extractText(update);
            Long userId = extractUserId(update);
            if (userId == null) return;
            if ("/start".equals(text) || (text != null && text.strip().toLowerCase().startsWith("/start"))) {
                botClient.sendMessage(userId, WELCOME_TEXT);
                log.info("Sent welcome to user {}", userId);
            }
        } catch (Exception e) {
            log.warn("Failed to handle update: {}", e.getMessage());
        }
    }

    private String extractText(UpdateDto update) {
        MessageDto msg = getMessage(update);
        if (msg == null || msg.getBody() == null) return null;
        return msg.getBody().getText();
    }

    private MessageDto getMessage(UpdateDto update) {
        if (update.getMessage() != null) return update.getMessage();
        if (update.getPayload() != null && update.getPayload().getMessage() != null) {
            return update.getPayload().getMessage();
        }
        return null;
    }

    private Long extractUserId(UpdateDto update) {
        MessageDto msg = getMessage(update);
        if (msg != null) {
            if (msg.getSender() != null && msg.getSender().getUserId() != null) {
                return msg.getSender().getUserId();
            }
            if (msg.getUserId() != null) return msg.getUserId();
        }
        return update.getUserId();
    }
}

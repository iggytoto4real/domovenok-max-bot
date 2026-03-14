package com.its.domovenok.bot.client;

import com.its.domovenok.bot.config.BotProperties;
import com.its.domovenok.bot.dto.GetUpdatesResponseDto;
import com.its.domovenok.bot.dto.UpdateDto;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class MaxBotClient {

    private final BotProperties props;
    private final RestTemplate restTemplate = new RestTemplate();

    public MaxBotClient(BotProperties props) {
        this.props = props;
    }

    /**
     * Long polling: GET /updates. Returns list of updates and optional marker for next page.
     */
    public GetUpdatesResult getUpdates(Integer limit, Integer timeoutSeconds, String marker) {
        if (props.getToken() == null || props.getToken().isBlank()) {
            return new GetUpdatesResult(Collections.emptyList(), null);
        }
        String url = props.getApiBaseUrl().replaceAll("/$", "") + "/updates";
        if (limit != null) url += (url.contains("?") ? "&" : "?") + "limit=" + limit;
        if (timeoutSeconds != null) url += (url.contains("?") ? "&" : "?") + "timeout=" + timeoutSeconds;
        if (marker != null && !marker.isBlank()) url += (url.contains("?") ? "&" : "?") + "marker=" + marker;

        HttpHeaders headers = new HttpHeaders();
        // MAX Bot API ожидает заголовок Authorization без префикса Bearer
        headers.set("Authorization", props.getToken());
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        ResponseEntity<GetUpdatesResponseDto> resp = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), GetUpdatesResponseDto.class);
        GetUpdatesResponseDto body = resp.getBody();
        if (body == null) return new GetUpdatesResult(Collections.emptyList(), null);

        List<UpdateDto> updates = body.getUpdatesList();
        return new GetUpdatesResult(updates, body.getMarker());
    }

    /**
     * Send text message to user.
     */
    public void sendMessage(long userId, String text) {
        if (props.getToken() == null || props.getToken().isBlank()) return;
        String url = props.getApiBaseUrl().replaceAll("/$", "") + "/messages?user_id=" + userId;

        HttpHeaders headers = new HttpHeaders();
        // MAX Bot API ожидает заголовок Authorization без префикса Bearer
        headers.set("Authorization", props.getToken());
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = Map.of("text", text != null ? text : "");
        restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(body, headers), Map.class);
    }

    public record GetUpdatesResult(List<UpdateDto> updates, String marker) {}
}

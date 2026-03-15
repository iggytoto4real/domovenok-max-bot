package com.its.domovenok.core.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class InitDataValidator {

    private static final Logger log = LoggerFactory.getLogger(InitDataValidator.class);
    private static final String WEB_APP_DATA = "WebAppData";
    private static final String HMAC_SHA256 = "HmacSHA256";

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Валидация по документации MAX: https://dev.max.ru/docs/webapps/validation
     * data_check_string — пары key=value (без hash), отсортированные по key, разделитель \n, значения URL-декодированы.
     */
    public Optional<Map<String, Object>> parseAndValidate(String initData, String botToken) {
        if (initData == null || initData.isBlank() || botToken == null || botToken.isBlank()) {
            log.debug("InitData validation failed: initData or botToken is blank");
            return Optional.empty();
        }
        Map<String, String> params = parseUrlEncoded(initData);
        String hash = params.remove("hash");
        if (hash == null || hash.isBlank()) {
            log.debug("InitData validation failed: hash is missing");
            return Optional.empty();
        }
        String dataCheckString = buildDataCheckString(params);
        try {
            byte[] secretKey = hmacSha256(WEB_APP_DATA.getBytes(StandardCharsets.UTF_8), botToken.getBytes(StandardCharsets.UTF_8));
            String computedHash = bytesToHex(hmacSha256(secretKey, dataCheckString.getBytes(StandardCharsets.UTF_8)));
            if (!computedHash.equalsIgnoreCase(hash)) {
                log.debug("InitData validation failed: hash mismatch (check MAX_BOT_TOKEN is the token of the bot that opened the mini-app)");
                return Optional.empty();
            }
        } catch (Exception e) {
            log.debug("InitData validation failed: HMAC error", e);
            return Optional.empty();
        }
        String userJson = params.get("user");
        if (userJson == null || userJson.isBlank()) {
            log.debug("InitData validation failed: user is missing");
            return Optional.empty();
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> user = objectMapper.readValue(userJson, Map.class);
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("id", user.get("id"));
            result.put("firstName", user.get("first_name"));
            result.put("lastName", user.get("last_name"));
            result.put("username", user.get("username"));
            result.put("photoUrl", user.get("photo_url"));
            result.put("languageCode", user.get("language_code"));
            return Optional.of(result);
        } catch (Exception e) {
            log.debug("InitData validation failed: user JSON parse error", e);
            return Optional.empty();
        }
    }

    private static Map<String, String> parseUrlEncoded(String encoded) {
        Map<String, String> out = new LinkedHashMap<>();
        for (String pair : encoded.split("&")) {
            int eq = pair.indexOf('=');
            if (eq <= 0) continue;
            String key = decode(pair.substring(0, eq));
            String value = eq < pair.length() - 1 ? decode(pair.substring(eq + 1)) : "";
            out.put(key, value);
        }
        return out;
    }

    private static String decode(String s) {
        try {
            return URLDecoder.decode(s, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return s;
        }
    }

    private static String buildDataCheckString(Map<String, String> params) {
        TreeMap<String, String> sorted = new TreeMap<>(params);
        List<String> parts = new ArrayList<>();
        for (Map.Entry<String, String> e : sorted.entrySet()) {
            parts.add(e.getKey() + "=" + e.getValue());
        }
        return String.join("\n", parts);
    }

    private static byte[] hmacSha256(byte[] key, byte[] message) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance(HMAC_SHA256);
        mac.init(new SecretKeySpec(key, HMAC_SHA256));
        return mac.doFinal(message);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}

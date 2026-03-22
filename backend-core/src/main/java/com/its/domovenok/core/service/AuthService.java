package com.its.domovenok.core.service;

import com.its.domovenok.core.config.BalanceConstants;
import com.its.domovenok.core.dto.AuthInitResponse;
import com.its.domovenok.core.dto.UserDto;
import com.its.domovenok.core.persistence.UserAccountEntity;
import com.its.domovenok.core.persistence.UserAccountRepository;
import com.its.domovenok.core.util.InitDataValidator;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final InitDataValidator initDataValidator;
    private final SessionStore sessionStore;
    private final UserAccountRepository userAccountRepository;

    @Value("${max.bot.token:}")
    private String botToken;

    public Optional<AuthInitResponse> init(String initData, String timeZone, Integer offsetHours) {
        Optional<Map<String, Object>> userOpt = initDataValidator.parseAndValidate(initData, botToken);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        Map<String, Object> userMap = userOpt.get();
        Object idObj = userMap.get("id");
        Long userId = idObj instanceof Number ? ((Number) idObj).longValue() : null;
        if (userId == null) {
            return Optional.empty();
        }

        int denyuzhki;
        int sokrovishcha;
        boolean firstVisit;
        Optional<UserAccountEntity> accountOpt = userAccountRepository.findById(userId);
        if (accountOpt.isEmpty()) {
            // пытаемся создать аккаунт; при гонке по id спокойно читаем уже существующий
            try {
                UserAccountEntity created =
                        new UserAccountEntity(userId, BalanceConstants.INITIAL_DENYUZHKI, BalanceConstants.INITIAL_SOKROVISHCHA);
                created.setTimeZone(timeZone);
                created.setOffsetHours(offsetHours);
                created = userAccountRepository.save(created);
                denyuzhki = created.getDenyuzhki();
                sokrovishcha = created.getSokrovishcha();
                firstVisit = true;
            } catch (DataIntegrityViolationException ex) {
                // параллельный init успел создать запись с тем же id — дозаполняем timezone, если ещё пусто
                UserAccountEntity account = userAccountRepository.findById(userId)
                        .orElseThrow(() -> ex);
                denyuzhki = account.getDenyuzhki();
                sokrovishcha = account.getSokrovishcha();
                firstVisit = false;
                if (applyTimeZoneIfAbsent(account, timeZone, offsetHours)) {
                    userAccountRepository.save(account);
                }
            }
        } else {
            UserAccountEntity account = accountOpt.get();
            denyuzhki = account.getDenyuzhki();
            sokrovishcha = account.getSokrovishcha();
            firstVisit = false;

            if (applyTimeZoneIfAbsent(account, timeZone, offsetHours)) {
                userAccountRepository.save(account);
            }
        }

        UserDto user = UserDto.of(userMap, denyuzhki, sokrovishcha);
        String token = UUID.randomUUID().toString();
        sessionStore.put(token, userId);

        return Optional.of(new AuthInitResponse(user, token, firstVisit));
    }

    /**
     * Заполняет часовой пояс / смещение только если в БД ещё {@code null} (не перетираем при каждом входе).
     *
     * @return {@code true}, если сущность изменилась и её нужно сохранить
     */
    private static boolean applyTimeZoneIfAbsent(UserAccountEntity account, String timeZone, Integer offsetHours) {
        boolean updated = false;
        if (account.getTimeZone() == null && timeZone != null && !timeZone.isBlank()) {
            account.setTimeZone(timeZone);
            updated = true;
        }
        if (account.getOffsetHours() == null && offsetHours != null) {
            account.setOffsetHours(offsetHours);
            updated = true;
        }
        return updated;
    }
}

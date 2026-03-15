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
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final InitDataValidator initDataValidator;
    private final SessionStore sessionStore;
    private final UserAccountRepository userAccountRepository;

    @Value("${max.bot.token:}")
    private String botToken;

    public Optional<AuthInitResponse> init(String initData) {
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
        Optional<UserAccountEntity> accountOpt = userAccountRepository.findById(userId);
        if (accountOpt.isEmpty()) {
            denyuzhki = BalanceConstants.INITIAL_DENYUZHKI;
            sokrovishcha = BalanceConstants.INITIAL_SOKROVISHCHA;
            userAccountRepository.save(new UserAccountEntity(userId, denyuzhki, sokrovishcha));
        } else {
            UserAccountEntity account = accountOpt.get();
            denyuzhki = account.getDenyuzhki();
            sokrovishcha = account.getSokrovishcha();
        }
        boolean firstVisit = accountOpt.isEmpty();

        UserDto user = UserDto.of(userMap, denyuzhki, sokrovishcha);
        String token = UUID.randomUUID().toString();
        sessionStore.put(token, userId);

        return Optional.of(new AuthInitResponse(user, token, firstVisit));
    }
}

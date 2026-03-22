package com.its.domovenok.core.util;

import com.its.domovenok.core.persistence.UserAccountEntity;
import java.time.ZoneId;
import java.time.ZoneOffset;

/**
 * Часовой пояс пользователя для расчётов по локальному времени (как в {@code TimeOfDayCalculator}).
 */
public final class UserZoneId {

    private UserZoneId() {}

    public static ZoneId fromAccount(UserAccountEntity account) {
        if (account == null) {
            return ZoneId.systemDefault();
        }
        String timeZone = account.getTimeZone();
        if (timeZone != null && !timeZone.isBlank()) {
            try {
                return ZoneId.of(timeZone);
            } catch (Exception ignored) {
                // fall through
            }
        }
        Integer offsetHours = account.getOffsetHours();
        if (offsetHours != null) {
            return ZoneOffset.ofHours(offsetHours);
        }
        return ZoneId.systemDefault();
    }
}

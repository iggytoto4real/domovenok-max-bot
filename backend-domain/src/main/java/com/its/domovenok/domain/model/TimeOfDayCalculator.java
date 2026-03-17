package com.its.domovenok.domain.model;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

public final class TimeOfDayCalculator {

    private static final int DEFAULT_DAY_START_HOUR = 8;
    private static final int DEFAULT_DAY_END_HOUR = 22;

    private TimeOfDayCalculator() {
    }

    public static TimeOfDay calculate(Instant instant, UserProfile profile) {
        if (instant == null || profile == null) {
            return TimeOfDay.DAY;
        }

        LocalDateTime localDateTime = toLocalDateTime(instant, profile);
        int hour = localDateTime.getHour();

        if (hour >= DEFAULT_DAY_START_HOUR && hour < DEFAULT_DAY_END_HOUR) {
            return TimeOfDay.DAY;
        }
        return TimeOfDay.NIGHT;
    }

    private static LocalDateTime toLocalDateTime(Instant instant, UserProfile profile) {
        String timeZone = profile.getTimeZone();
        Integer offsetHours = profile.getOffsetHours();

        if (timeZone != null && !timeZone.isBlank()) {
            try {
                ZoneId zoneId = ZoneId.of(timeZone);
                return LocalDateTime.ofInstant(instant, zoneId);
            } catch (Exception ignored) {
            }
        }

        if (offsetHours != null) {
            ZoneOffset offset = ZoneOffset.ofHours(offsetHours);
            return LocalDateTime.ofInstant(instant, offset);
        }

        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }
}


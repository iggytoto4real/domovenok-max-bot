package com.its.domovenok.core.service;

import com.its.domovenok.core.config.BalanceConstants;
import com.its.domovenok.core.persistence.UserAccountEntity;
import com.its.domovenok.core.persistence.UserAccountRepository;
import com.its.domovenok.core.util.UserZoneId;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Ежедневное начисление денюжек: раз в час проверяем, у кого в локальном времени сейчас «утро»
 * ({@link BalanceConstants#DAILY_INCOME_LOCAL_HOUR}:00) и за эту локальную дату ещё не было выплаты.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DailyIncomeService {

    private final UserAccountRepository userAccountRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void grantDailyIncome() {
        Instant now = Instant.now();
        List<UserAccountEntity> accounts = userAccountRepository.findAll();
        if (accounts.isEmpty()) {
            return;
        }

        List<UserAccountEntity> toSave = new ArrayList<>();
        for (UserAccountEntity account : accounts) {
            ZoneId zone = UserZoneId.fromAccount(account);
            ZonedDateTime zoned = now.atZone(zone);
            int localHour = zoned.getHour();
            LocalDate todayLocal = zoned.toLocalDate();

            if (localHour != BalanceConstants.DAILY_INCOME_LOCAL_HOUR) {
                continue;
            }

            LocalDate last = account.getLastDailyIncomeLocalDate();
            if (last != null && last.equals(todayLocal)) {
                continue;
            }

            account.setDenyuzhki(account.getDenyuzhki() + BalanceConstants.DAILY_INCOME_DENYUZHKI);
            account.setLastDailyIncomeLocalDate(todayLocal);
            toSave.add(account);
        }

        if (!toSave.isEmpty()) {
            userAccountRepository.saveAll(toSave);
            log.info(
                    "Daily income: credited {} user(s) with {} denyuzhki each (local morning hour {})",
                    toSave.size(),
                    BalanceConstants.DAILY_INCOME_DENYUZHKI,
                    BalanceConstants.DAILY_INCOME_LOCAL_HOUR);
        }
    }
}

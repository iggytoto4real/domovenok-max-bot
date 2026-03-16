package com.its.domovenok.core.service;

import com.its.domovenok.core.persistence.PetEntity;
import com.its.domovenok.core.persistence.PetRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetDegradationService {

    private static final int MAX_STAT = 100;
    private static final int MIN_STAT = 0;

    private static final int HOURLY_HUNGER_DELTA = 5;
    private static final int DAILY_HAPPINESS_DELTA = 5;

    private final PetRepository petRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void increaseHungerHourly() {
        List<PetEntity> pets = petRepository.findAll();
        if (pets.isEmpty()) {
            return;
        }
        Instant now = Instant.now();
        for (PetEntity pet : pets) {
            int newHunger = Math.min(MAX_STAT, pet.getHunger() + HOURLY_HUNGER_DELTA);
            if (newHunger != pet.getHunger()) {
                pet.setHunger(newHunger);
                pet.setLastUpdatedAt(now);
            }
        }
        petRepository.saveAll(pets);
        log.debug("Hourly hunger degradation applied for {} pets", pets.size());
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void decreaseHappinessDaily() {
        List<PetEntity> pets = petRepository.findAll();
        if (pets.isEmpty()) {
            return;
        }
        Instant now = Instant.now();
        for (PetEntity pet : pets) {
            int newHappiness = Math.max(MIN_STAT, pet.getHappiness() - DAILY_HAPPINESS_DELTA);
            if (newHappiness != pet.getHappiness()) {
                pet.setHappiness(newHappiness);
                pet.setLastUpdatedAt(now);
            }
        }
        petRepository.saveAll(pets);
        log.debug("Daily happiness degradation applied for {} pets", pets.size());
    }
}


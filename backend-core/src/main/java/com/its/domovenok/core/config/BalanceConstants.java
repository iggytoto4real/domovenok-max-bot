package com.its.domovenok.core.config;

/** Стартовый баланс и цены для экономики игры. */
public final class BalanceConstants {

    public static final int INITIAL_DENYUZHKI = 1000;
    public static final int INITIAL_SOKROVISHCHA = 1;

    /** Цена покупки нового питомца в денюжках. */
    public static final int PET_PRICE_DENYUZHKI = 300;

    /** Ежедневное начисление денюжек (один раз за локальный календарный день). */
    public static final int DAILY_INCOME_DENYUZHKI = 500;

    /**
     * Локальный час, в который срабатывает начисление (включительно весь этот час: 8:00–8:59).
     * Совпадает с началом «дня» в {@link com.its.domovenok.domain.model.TimeOfDayCalculator}.
     */
    public static final int DAILY_INCOME_LOCAL_HOUR = 8;

    private BalanceConstants() {}
}

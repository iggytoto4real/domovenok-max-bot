package com.its.domovenok.domain.model;

/**
 * Тип домового. Строковые значения совпадают с id типов в mini-app (DomovoyTypeId).
 */
public enum DomovoyType {
    domovoy,
    dvorovoy,
    bannik,
    ovinnik,
    khlevnik,
    kikimora;

    /**
     * Парсит строку в тип. Возвращает null, если строка не соответствует ни одному типу.
     */
    public static DomovoyType fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = value.trim().toLowerCase();
        for (DomovoyType t : values()) {
            if (t.name().equals(normalized)) {
                return t;
            }
        }
        return null;
    }
}

package com.its.domovenok.core.service;

/**
 * Бросается, когда у пользователя недостаточно денюжек для покупки питомца или другой операции.
 */
public class InsufficientFundsException extends RuntimeException {

    public InsufficientFundsException(String message) {
        super(message);
    }
}


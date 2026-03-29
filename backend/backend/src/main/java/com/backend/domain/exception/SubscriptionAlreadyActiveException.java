package com.backend.domain.exception;

public class SubscriptionAlreadyActiveException extends RuntimeException {

    public SubscriptionAlreadyActiveException(String message) {
        super(message);
    }
}

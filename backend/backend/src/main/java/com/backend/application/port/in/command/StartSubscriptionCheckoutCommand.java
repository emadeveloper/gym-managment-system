package com.backend.application.port.in.command;

public record StartSubscriptionCheckoutCommand(
        String authenticatedEmail,
        String planCode
) {
}

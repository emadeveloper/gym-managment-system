package com.backend.application.dto;

import com.backend.domain.valueobject.SubscriptionStatus;

import java.time.Instant;
import java.util.UUID;

public record SubscriptionStatusDto(
        UUID subscriptionId,
        String plan,
        boolean active,
        SubscriptionStatus status,
        Instant renewalDate,
        long monthsActive,
        String paymentMethod
) {
}

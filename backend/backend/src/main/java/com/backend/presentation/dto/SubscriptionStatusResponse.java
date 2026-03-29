package com.backend.presentation.dto;

import com.backend.domain.valueobject.SubscriptionStatus;

import java.time.Instant;
import java.util.UUID;

public record SubscriptionStatusResponse(
        UUID subscriptionId,
        String plan,
        boolean active,
        SubscriptionStatus status,
        Instant renewalDate,
        long monthsActive,
        String paymentMethod
) {
}

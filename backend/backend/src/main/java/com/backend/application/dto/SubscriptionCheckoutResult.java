package com.backend.application.dto;

import com.backend.domain.valueobject.SubscriptionStatus;

import java.util.UUID;

public record SubscriptionCheckoutResult(
        UUID subscriptionId,
        String checkoutUrl,
        String providerReference,
        SubscriptionStatus status
) {
}

package com.backend.presentation.dto;

import com.backend.domain.valueobject.SubscriptionStatus;

import java.util.UUID;

public record SubscriptionCheckoutResponse(
        UUID subscriptionId,
        String checkoutUrl,
        String providerReference,
        SubscriptionStatus status
) {
}

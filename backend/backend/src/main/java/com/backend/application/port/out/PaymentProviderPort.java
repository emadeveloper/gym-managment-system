package com.backend.application.port.out;

import com.backend.domain.valueobject.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.Instant;

public interface PaymentProviderPort {

    ProviderCheckoutSession createSubscription(CreateSubscriptionRequest request);

    ProviderSubscriptionSnapshot getSubscription(String providerSubscriptionId);

    void validateWebhookSignature(String xSignature, String xRequestId, String dataId);

    record CreateSubscriptionRequest(
            String payerEmail,
            String reason,
            String externalReference,
            BigDecimal transactionAmount,
            String currencyId,
            int frequency,
            String frequencyType,
            String backUrl
    ) {
    }

    record ProviderCheckoutSession(
            String providerSubscriptionId,
            String checkoutUrl,
            SubscriptionStatus status
    ) {
    }

    record ProviderSubscriptionSnapshot(
            String providerSubscriptionId,
            String externalReference,
            String payerEmail,
            String checkoutUrl,
            SubscriptionStatus status,
            Instant nextBillingDate,
            Instant updatedAt
    ) {
    }
}

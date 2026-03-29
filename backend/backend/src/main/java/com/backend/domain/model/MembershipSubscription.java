package com.backend.domain.model;

import com.backend.domain.valueobject.SubscriptionStatus;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@ToString(of = {"id", "userId", "planCode", "status", "provider", "providerReference"})
@EqualsAndHashCode(of = "id")
public class MembershipSubscription {

    private final UUID id;
    private final UUID userId;
    private final String provider;
    private final String planCode;
    private final String planName;
    private final BigDecimal amount;
    private final String currencyId;
    private final String payerEmail;
    private final String externalReference;

    private SubscriptionStatus status;
    private String providerReference;
    private String checkoutUrl;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant activatedAt;
    private Instant currentPeriodEndAt;
    private Instant canceledAt;
    private Instant lastWebhookAt;

    public static MembershipSubscription pending(
            UUID userId,
            String provider,
            String planCode,
            String planName,
            BigDecimal amount,
            String currencyId,
            String payerEmail
    ) {
        UUID id = UUID.randomUUID();
        Instant now = Instant.now();
        return new MembershipSubscription(
                id,
                userId,
                provider,
                planCode,
                planName,
                amount,
                currencyId,
                payerEmail,
                id.toString(),
                SubscriptionStatus.PENDING,
                null,
                null,
                now,
                now,
                null,
                null,
                null,
                null
        );
    }

    public MembershipSubscription(
            UUID id,
            UUID userId,
            String provider,
            String planCode,
            String planName,
            BigDecimal amount,
            String currencyId,
            String payerEmail,
            String externalReference,
            SubscriptionStatus status,
            String providerReference,
            String checkoutUrl,
            Instant createdAt,
            Instant updatedAt,
            Instant activatedAt,
            Instant currentPeriodEndAt,
            Instant canceledAt,
            Instant lastWebhookAt
    ) {
        if (id == null) {
            throw new IllegalArgumentException("Subscription id cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User id cannot be null");
        }
        if (provider == null || provider.isBlank()) {
            throw new IllegalArgumentException("Provider cannot be blank");
        }
        if (planCode == null || planCode.isBlank()) {
            throw new IllegalArgumentException("Plan code cannot be blank");
        }
        if (planName == null || planName.isBlank()) {
            throw new IllegalArgumentException("Plan name cannot be blank");
        }
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (currencyId == null || currencyId.isBlank()) {
            throw new IllegalArgumentException("Currency cannot be blank");
        }
        if (payerEmail == null || payerEmail.isBlank()) {
            throw new IllegalArgumentException("Payer email cannot be blank");
        }
        if (externalReference == null || externalReference.isBlank()) {
            throw new IllegalArgumentException("External reference cannot be blank");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        this.id = id;
        this.userId = userId;
        this.provider = provider;
        this.planCode = planCode;
        this.planName = planName;
        this.amount = amount;
        this.currencyId = currencyId;
        this.payerEmail = payerEmail;
        this.externalReference = externalReference;
        this.status = status;
        this.providerReference = providerReference;
        this.checkoutUrl = checkoutUrl;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : this.createdAt;
        this.activatedAt = activatedAt;
        this.currentPeriodEndAt = currentPeriodEndAt;
        this.canceledAt = canceledAt;
        this.lastWebhookAt = lastWebhookAt;
    }

    public void attachCheckoutSession(String providerReference, String checkoutUrl, SubscriptionStatus providerStatus) {
        if (providerReference == null || providerReference.isBlank()) {
            throw new IllegalArgumentException("Provider reference cannot be blank");
        }
        if (checkoutUrl == null || checkoutUrl.isBlank()) {
            throw new IllegalArgumentException("Checkout URL cannot be blank");
        }

        this.providerReference = providerReference;
        this.checkoutUrl = checkoutUrl;
        transitionTo(providerStatus != null ? providerStatus : SubscriptionStatus.PENDING, null, Instant.now());
    }

    public void synchronize(
            SubscriptionStatus nextStatus,
            Instant nextBillingDate,
            Instant processedAt,
            String providerReference,
            String checkoutUrl
    ) {
        if (providerReference != null && !providerReference.isBlank()) {
            this.providerReference = providerReference;
        }
        if (checkoutUrl != null && !checkoutUrl.isBlank()) {
            this.checkoutUrl = checkoutUrl;
        }

        transitionTo(nextStatus, nextBillingDate, processedAt != null ? processedAt : Instant.now());
        this.lastWebhookAt = processedAt != null ? processedAt : Instant.now();
    }

    public boolean isOperational() {
        return status == SubscriptionStatus.PENDING
                || status == SubscriptionStatus.ACTIVE
                || status == SubscriptionStatus.PAST_DUE;
    }

    private void transitionTo(SubscriptionStatus nextStatus, Instant nextBillingDate, Instant changedAt) {
        if (nextStatus == null) {
            throw new IllegalArgumentException("Subscription status cannot be null");
        }

        this.status = nextStatus;
        this.updatedAt = changedAt;

        if (nextStatus == SubscriptionStatus.ACTIVE && activatedAt == null) {
            this.activatedAt = changedAt;
        }

        if (nextBillingDate != null) {
            this.currentPeriodEndAt = nextBillingDate;
        }

        if (nextStatus == SubscriptionStatus.CANCELED || nextStatus == SubscriptionStatus.EXPIRED) {
            this.canceledAt = changedAt;
        }
    }
}

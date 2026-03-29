package com.backend.infrastructure.adapter.out.persistence.entity;

import com.backend.domain.valueobject.SubscriptionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "membership_subscriptions", indexes = {
        @Index(name = "idx_membership_subscriptions_user_id", columnList = "user_id"),
        @Index(name = "idx_membership_subscriptions_status", columnList = "status"),
        @Index(name = "idx_membership_subscriptions_provider_reference", columnList = "provider_reference")
})
@Getter
@Setter
@NoArgsConstructor
public class MembershipSubscriptionJpaEntity {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserJpaEntity user;

    @Column(name = "provider", nullable = false)
    private String provider;

    @Column(name = "provider_reference", unique = true)
    private String providerReference;

    @Column(name = "external_reference", nullable = false, unique = true)
    private String externalReference;

    @Column(name = "plan_code", nullable = false)
    private String planCode;

    @Column(name = "plan_name", nullable = false)
    private String planName;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency_id", nullable = false)
    private String currencyId;

    @Column(name = "payer_email", nullable = false)
    private String payerEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SubscriptionStatus status;

    @Column(name = "checkout_url", columnDefinition = "TEXT")
    private String checkoutUrl;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "activated_at")
    private Instant activatedAt;

    @Column(name = "current_period_end_at")
    private Instant currentPeriodEndAt;

    @Column(name = "canceled_at")
    private Instant canceledAt;

    @Column(name = "last_webhook_at")
    private Instant lastWebhookAt;
}

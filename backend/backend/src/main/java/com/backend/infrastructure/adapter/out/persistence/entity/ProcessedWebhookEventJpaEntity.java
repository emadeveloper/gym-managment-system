package com.backend.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "processed_webhook_events")
@Getter
@Setter
@NoArgsConstructor
public class ProcessedWebhookEventJpaEntity {

    @Id
    @Column(name = "event_key", nullable = false, updatable = false)
    private String eventKey;

    @Column(name = "provider", nullable = false)
    private String provider;

    @Column(name = "resource_id", nullable = false)
    private String resourceId;

    @Column(name = "action")
    private String action;

    @Column(name = "processed_at", nullable = false)
    private Instant processedAt;
}

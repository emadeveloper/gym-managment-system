package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.ProcessedWebhookEventJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataProcessedWebhookEventRepository extends JpaRepository<ProcessedWebhookEventJpaEntity, String> {
}

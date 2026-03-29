package com.backend.infrastructure.adapter.out.persistence;

import com.backend.application.port.out.ProcessedWebhookEventRepositoryPort;
import com.backend.infrastructure.adapter.out.persistence.entity.ProcessedWebhookEventJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataProcessedWebhookEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class ProcessedWebhookEventRepositoryAdapter implements ProcessedWebhookEventRepositoryPort {

    private final SpringDataProcessedWebhookEventRepository repository;

    @Override
    public boolean existsByEventKey(String eventKey) {
        return repository.existsById(eventKey);
    }

    @Override
    public void save(String eventKey, String provider, String resourceId, String action) {
        ProcessedWebhookEventJpaEntity entity = new ProcessedWebhookEventJpaEntity();
        entity.setEventKey(eventKey);
        entity.setProvider(provider);
        entity.setResourceId(resourceId);
        entity.setAction(action);
        entity.setProcessedAt(Instant.now());
        repository.save(entity);
    }
}

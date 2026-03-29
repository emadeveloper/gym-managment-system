package com.backend.application.port.out;

public interface ProcessedWebhookEventRepositoryPort {
    boolean existsByEventKey(String eventKey);

    void save(String eventKey, String provider, String resourceId, String action);
}

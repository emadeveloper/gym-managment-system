package com.backend.presentation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MercadoPagoWebhookRequest(
        String id,
        String type,
        String action,
        Data data
) {
    public record Data(
            @JsonProperty("id") String id
    ) {
    }
}

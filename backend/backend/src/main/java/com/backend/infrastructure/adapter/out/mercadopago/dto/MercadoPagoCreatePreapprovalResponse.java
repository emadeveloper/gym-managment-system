package com.backend.infrastructure.adapter.out.mercadopago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MercadoPagoCreatePreapprovalResponse(
        String id,
        String status,
        @JsonProperty("init_point") String initPoint
) {
}

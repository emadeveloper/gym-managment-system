package com.backend.infrastructure.adapter.out.mercadopago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

public record MercadoPagoGetPreapprovalResponse(
        String id,
        String status,
        @JsonProperty("external_reference") String externalReference,
        @JsonProperty("payer_email") String payerEmail,
        @JsonProperty("init_point") String initPoint,
        @JsonProperty("next_payment_date") Instant nextPaymentDate,
        @JsonProperty("date_modified") Instant dateModified
) {
}

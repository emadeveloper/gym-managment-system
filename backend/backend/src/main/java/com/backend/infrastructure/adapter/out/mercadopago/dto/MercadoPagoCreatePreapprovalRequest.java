package com.backend.infrastructure.adapter.out.mercadopago.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record MercadoPagoCreatePreapprovalRequest(
        String reason,
        @JsonProperty("external_reference") String externalReference,
        @JsonProperty("payer_email") String payerEmail,
        @JsonProperty("back_url") String backUrl,
        @JsonProperty("auto_recurring") AutoRecurring autoRecurring
) {
    public record AutoRecurring(
            int frequency,
            @JsonProperty("frequency_type") String frequencyType,
            @JsonProperty("transaction_amount") BigDecimal transactionAmount,
            @JsonProperty("currency_id") String currencyId
    ) {
    }
}

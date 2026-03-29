package com.backend.infrastructure.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@Getter
@Setter
@ConfigurationProperties(prefix = "mercadopago")
public class MercadoPagoProperties {

    private boolean enabled = false;
    private String accessToken;
    private String webhookSecret;
    private String baseUrl = "https://api.mercadopago.com";
    private String backUrl = "http://localhost:5173/dashboard";
    private String defaultPlanCode = "monthly-standard";
    private String defaultPlanName = "Membresia mensual";
    private String currencyId = "ARS";
    private BigDecimal transactionAmount = BigDecimal.valueOf(25000);
    private int frequency = 1;
    private String frequencyType = "months";
}

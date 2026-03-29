package com.backend.infrastructure.adapter.out.mercadopago;

import com.backend.application.port.out.PaymentProviderPort;
import com.backend.domain.exception.InvalidWebhookSignatureException;
import com.backend.domain.valueobject.SubscriptionStatus;
import com.backend.infrastructure.adapter.out.mercadopago.dto.MercadoPagoCreatePreapprovalRequest;
import com.backend.infrastructure.adapter.out.mercadopago.dto.MercadoPagoCreatePreapprovalResponse;
import com.backend.infrastructure.adapter.out.mercadopago.dto.MercadoPagoGetPreapprovalResponse;
import com.backend.infrastructure.config.MercadoPagoProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class MercadoPagoPaymentProviderAdapter implements PaymentProviderPort {

    private final RestClient mercadoPagoRestClient;
    private final MercadoPagoProperties properties;

    @Override
    public ProviderCheckoutSession createSubscription(CreateSubscriptionRequest request) {
        ensureIntegrationEnabled();

        MercadoPagoCreatePreapprovalResponse response = mercadoPagoRestClient.post()
                .uri("/preapproval")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getAccessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(new MercadoPagoCreatePreapprovalRequest(
                        request.reason(),
                        request.externalReference(),
                        request.payerEmail(),
                        request.backUrl(),
                        new MercadoPagoCreatePreapprovalRequest.AutoRecurring(
                                request.frequency(),
                                request.frequencyType(),
                                request.transactionAmount(),
                                request.currencyId()
                        )
                ))
                .retrieve()
                .body(MercadoPagoCreatePreapprovalResponse.class);

        if (response == null || response.id() == null || response.id().isBlank()) {
            throw new IllegalStateException("Mercado Pago did not return a subscription identifier.");
        }

        return new ProviderCheckoutSession(
                response.id(),
                response.initPoint(),
                mapStatus(response.status())
        );
    }

    @Override
    public ProviderSubscriptionSnapshot getSubscription(String providerSubscriptionId) {
        ensureIntegrationEnabled();

        MercadoPagoGetPreapprovalResponse response = mercadoPagoRestClient.get()
                .uri("/preapproval/{id}", providerSubscriptionId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getAccessToken())
                .retrieve()
                .body(MercadoPagoGetPreapprovalResponse.class);

        if (response == null || response.id() == null || response.id().isBlank()) {
            throw new IllegalStateException("Mercado Pago did not return subscription details.");
        }

        return new ProviderSubscriptionSnapshot(
                response.id(),
                response.externalReference(),
                response.payerEmail(),
                response.initPoint(),
                mapStatus(response.status()),
                response.nextPaymentDate(),
                response.dateModified() != null ? response.dateModified() : Instant.now()
        );
    }

    @Override
    public void validateWebhookSignature(String xSignature, String xRequestId, String dataId) {
        String secret = properties.getWebhookSecret();
        if (secret == null || secret.isBlank()) {
            return;
        }
        if (xSignature == null || xSignature.isBlank()) {
            throw new InvalidWebhookSignatureException("Missing Mercado Pago webhook signature.");
        }
        if (xRequestId == null || xRequestId.isBlank()) {
            throw new InvalidWebhookSignatureException("Missing Mercado Pago request id.");
        }

        Map<String, String> signatureParts = parseSignature(xSignature);
        String ts = signatureParts.get("ts");
        String receivedV1 = signatureParts.get("v1");
        if (ts == null || receivedV1 == null) {
            throw new InvalidWebhookSignatureException("Invalid Mercado Pago webhook signature header.");
        }

        String manifest = "id:" + dataId + ";request-id:" + xRequestId + ";ts:" + ts + ";";
        String expected = hmacSha256(secret, manifest);
        boolean matches = MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                receivedV1.toLowerCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8)
        );

        if (!matches) {
            throw new InvalidWebhookSignatureException("Invalid Mercado Pago webhook signature.");
        }
    }

    private void ensureIntegrationEnabled() {
        if (!properties.isEnabled()) {
            throw new IllegalStateException("Mercado Pago integration is disabled.");
        }
        if (properties.getAccessToken() == null || properties.getAccessToken().isBlank()) {
            throw new IllegalStateException("Mercado Pago access token is not configured.");
        }
    }

    private SubscriptionStatus mapStatus(String providerStatus) {
        if (providerStatus == null || providerStatus.isBlank()) {
            return SubscriptionStatus.PENDING;
        }

        return switch (providerStatus.toLowerCase(Locale.ROOT)) {
            case "authorized", "active" -> SubscriptionStatus.ACTIVE;
            case "paused" -> SubscriptionStatus.PAST_DUE;
            case "cancelled", "canceled" -> SubscriptionStatus.CANCELED;
            case "expired" -> SubscriptionStatus.EXPIRED;
            default -> SubscriptionStatus.PENDING;
        };
    }

    private Map<String, String> parseSignature(String xSignature) {
        Map<String, String> values = new HashMap<>();
        Arrays.stream(xSignature.split(","))
                .map(String::trim)
                .map(entry -> entry.split("=", 2))
                .filter(parts -> parts.length == 2)
                .forEach(parts -> values.put(parts[0], parts[1]));
        return values;
    }

    private String hmacSha256(String secret, String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder builder = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                builder.append(String.format("%02x", b));
            }
            return builder.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("Could not validate Mercado Pago signature.", ex);
        }
    }
}

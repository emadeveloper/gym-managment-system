package com.backend.presentation.controller;

import com.backend.application.port.out.PaymentProviderPort;
import com.backend.presentation.dto.RegisterUserRequest;
import com.backend.support.PostgresContainerTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers(disabledWithoutDocker = true)
class SubscriptionControllerIntegrationTest extends PostgresContainerTestSupport {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentProviderPort paymentProviderPort;

    @Test
    void shouldStartCheckoutAndExposeSubscriptionStatus() throws Exception {
        AuthSession session = registerUser("subscriptions@example.com", "Password123");
        when(paymentProviderPort.createSubscription(any())).thenReturn(
                new PaymentProviderPort.ProviderCheckoutSession(
                        "preapp-123",
                        "https://mp/init",
                        com.backend.domain.valueobject.SubscriptionStatus.PENDING
                )
        );

        mockMvc.perform(post("/api/v1/billing/subscriptions/checkout")
                        .header("Authorization", "Bearer " + session.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"planCode\":\"monthly-standard\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.providerReference").value("preapp-123"))
                .andExpect(jsonPath("$.checkoutUrl").value("https://mp/init"))
                .andExpect(jsonPath("$.status").value("PENDING"));

        mockMvc.perform(get("/api/v1/billing/subscriptions/me")
                        .header("Authorization", "Bearer " + session.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plan").value("Membresia mensual"))
                .andExpect(jsonPath("$.active").value(false))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void shouldAllowWebhookWithoutAuthenticationAndUpdateStatus() throws Exception {
        AuthSession session = registerUser("webhook@example.com", "Password123");
        when(paymentProviderPort.createSubscription(any())).thenReturn(
                new PaymentProviderPort.ProviderCheckoutSession(
                        "preapp-456",
                        "https://mp/init-456",
                        com.backend.domain.valueobject.SubscriptionStatus.PENDING
                )
        );

        mockMvc.perform(post("/api/v1/billing/subscriptions/checkout")
                        .header("Authorization", "Bearer " + session.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk());

        doNothing().when(paymentProviderPort).validateWebhookSignature("ts=1,v1=test", "req-123", "preapp-456");
        when(paymentProviderPort.getSubscription(eq("preapp-456"))).thenReturn(
                new PaymentProviderPort.ProviderSubscriptionSnapshot(
                        "preapp-456",
                        null,
                        "webhook@example.com",
                        "https://mp/init-456",
                        com.backend.domain.valueobject.SubscriptionStatus.ACTIVE,
                        Instant.now().plus(30, ChronoUnit.DAYS),
                        Instant.now()
                )
        );

        mockMvc.perform(post("/api/v1/billing/webhooks/mercadopago")
                        .header("x-signature", "ts=1,v1=test")
                        .header("x-request-id", "req-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "id":"notif-1",
                                  "type":"subscription_preapproval",
                                  "action":"updated",
                                  "data":{"id":"preapp-456"}
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/billing/subscriptions/me")
                        .header("Authorization", "Bearer " + session.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(true))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.paymentMethod").value("Mercado Pago"));
    }

    private AuthSession registerUser(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterUserRequest(email, password))))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode payload = objectMapper.readTree(result.getResponse().getContentAsString());
        return new AuthSession(payload.get("id").asText(), payload.get("token").asText());
    }

    private record AuthSession(String userId, String token) {
    }
}

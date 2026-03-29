package com.backend.application.service;

import com.backend.application.dto.SubscriptionCheckoutResult;
import com.backend.application.dto.SubscriptionStatusDto;
import com.backend.application.port.in.command.ProcessPaymentWebhookCommand;
import com.backend.application.port.in.command.StartSubscriptionCheckoutCommand;
import com.backend.application.port.out.PaymentProviderPort;
import com.backend.application.port.out.ProcessedWebhookEventRepositoryPort;
import com.backend.application.port.out.SubscriptionRepositoryPort;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.SubscriptionAlreadyActiveException;
import com.backend.domain.model.MembershipSubscription;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import com.backend.domain.valueobject.SubscriptionStatus;
import com.backend.infrastructure.config.MercadoPagoProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private SubscriptionRepositoryPort subscriptionRepository;

    @Mock
    private ProcessedWebhookEventRepositoryPort processedWebhookEventRepository;

    @Mock
    private PaymentProviderPort paymentProviderPort;

    private MercadoPagoProperties mercadoPagoProperties;

    @InjectMocks
    private SubscriptionService service;

    @BeforeEach
    void setUp() {
        mercadoPagoProperties = new MercadoPagoProperties();
        mercadoPagoProperties.setDefaultPlanCode("monthly-standard");
        mercadoPagoProperties.setDefaultPlanName("Membresia mensual");
        mercadoPagoProperties.setTransactionAmount(BigDecimal.valueOf(25000));
        mercadoPagoProperties.setCurrencyId("ARS");
        mercadoPagoProperties.setFrequency(1);
        mercadoPagoProperties.setFrequencyType("months");
        mercadoPagoProperties.setBackUrl("http://localhost:5173/dashboard");

        service = new SubscriptionService(
                userRepository,
                subscriptionRepository,
                processedWebhookEventRepository,
                paymentProviderPort,
                mercadoPagoProperties
        );
    }

    @Test
    void shouldStartCheckoutForUserWithoutOperationalSubscription() {
        User user = buildUser("member@example.com");
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(user));
        when(subscriptionRepository.findOperationalByUserId(user.getId())).thenReturn(Optional.empty());
        when(paymentProviderPort.createSubscription(any())).thenReturn(
                new PaymentProviderPort.ProviderCheckoutSession("preapp-123", "https://mp/init", SubscriptionStatus.PENDING)
        );
        when(subscriptionRepository.save(any(MembershipSubscription.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SubscriptionCheckoutResult result = service.startCheckout(
                new StartSubscriptionCheckoutCommand("member@example.com", null)
        );

        assertEquals("preapp-123", result.providerReference());
        assertEquals("https://mp/init", result.checkoutUrl());
        assertEquals(SubscriptionStatus.PENDING, result.status());

        ArgumentCaptor<MembershipSubscription> subscriptionCaptor = ArgumentCaptor.forClass(MembershipSubscription.class);
        verify(subscriptionRepository).save(subscriptionCaptor.capture());
        assertEquals("monthly-standard", subscriptionCaptor.getValue().getPlanCode());
        assertEquals("member@example.com", subscriptionCaptor.getValue().getPayerEmail());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertNotNull(userCaptor.getValue().getCurrentSubscriptionId());
    }

    @Test
    void shouldRejectCheckoutWhenOperationalSubscriptionExists() {
        User user = buildUser("member@example.com");
        MembershipSubscription existing = MembershipSubscription.pending(
                user.getId(),
                "MERCADO_PAGO",
                "monthly-standard",
                "Membresia mensual",
                BigDecimal.TEN,
                "ARS",
                "member@example.com"
        );

        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(user));
        when(subscriptionRepository.findOperationalByUserId(user.getId())).thenReturn(Optional.of(existing));

        assertThrows(SubscriptionAlreadyActiveException.class, () ->
                service.startCheckout(new StartSubscriptionCheckoutCommand("member@example.com", null))
        );

        verify(paymentProviderPort, never()).createSubscription(any());
    }

    @Test
    void shouldProcessWebhookAndActivateSubscription() {
        User user = buildUser("member@example.com");
        MembershipSubscription subscription = MembershipSubscription.pending(
                user.getId(),
                "MERCADO_PAGO",
                "monthly-standard",
                "Membresia mensual",
                BigDecimal.valueOf(25000),
                "ARS",
                "member@example.com"
        );
        subscription.attachCheckoutSession("preapp-123", "https://mp/init", SubscriptionStatus.PENDING);

        when(processedWebhookEventRepository.existsByEventKey(anyString())).thenReturn(false);
        when(paymentProviderPort.getSubscription("preapp-123")).thenReturn(
                new PaymentProviderPort.ProviderSubscriptionSnapshot(
                        "preapp-123",
                        subscription.getExternalReference(),
                        "member@example.com",
                        "https://mp/init",
                        SubscriptionStatus.ACTIVE,
                        Instant.now().plus(30, ChronoUnit.DAYS),
                        Instant.now()
                )
        );
        when(subscriptionRepository.findByProviderReference("preapp-123")).thenReturn(Optional.of(subscription));
        when(subscriptionRepository.save(any(MembershipSubscription.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.process(new ProcessPaymentWebhookCommand(
                "notif-1",
                "subscription_preapproval",
                "updated",
                "preapp-123",
                "ts=1,v1=abc",
                "req-1"
        ));

        verify(paymentProviderPort).validateWebhookSignature("ts=1,v1=abc", "req-1", "preapp-123");
        verify(processedWebhookEventRepository).save(anyString(), anyString(), anyString(), anyString());
        assertEquals(subscription.getId(), user.getCurrentSubscriptionId());
        assertEquals(SubscriptionStatus.ACTIVE, subscription.getStatus());
    }

    @Test
    void shouldReturnInactiveStatusWhenUserHasNoCurrentSubscription() {
        User user = buildUser("member@example.com");
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(user));

        SubscriptionStatusDto result = service.getMySubscriptionStatus("member@example.com");

        assertEquals("Sin plan asignado", result.plan());
        assertFalse(result.active());
        assertEquals(0, result.monthsActive());
    }

    private User buildUser(String email) {
        return new User(
                UUID.randomUUID(),
                "Juan",
                "Perez",
                new Email(email),
                "$2a$10$abcdefghijklmnopqrstuv",
                Role.USER,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                Instant.now(),
                Instant.now(),
                null,
                true,
                false
        );
    }
}

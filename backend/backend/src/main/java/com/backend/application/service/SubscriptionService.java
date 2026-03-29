package com.backend.application.service;

import com.backend.application.dto.SubscriptionCheckoutResult;
import com.backend.application.dto.SubscriptionStatusDto;
import com.backend.application.port.in.GetMySubscriptionStatusUseCase;
import com.backend.application.port.in.ProcessPaymentWebhookUseCase;
import com.backend.application.port.in.StartSubscriptionCheckoutUseCase;
import com.backend.application.port.in.command.ProcessPaymentWebhookCommand;
import com.backend.application.port.in.command.StartSubscriptionCheckoutCommand;
import com.backend.application.port.out.PaymentProviderPort;
import com.backend.application.port.out.ProcessedWebhookEventRepositoryPort;
import com.backend.application.port.out.SubscriptionRepositoryPort;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.SubscriptionAlreadyActiveException;
import com.backend.domain.exception.SubscriptionNotFoundException;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.MembershipSubscription;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.SubscriptionStatus;
import com.backend.infrastructure.config.MercadoPagoProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SubscriptionService implements
        StartSubscriptionCheckoutUseCase,
        ProcessPaymentWebhookUseCase,
        GetMySubscriptionStatusUseCase {

    private static final String PROVIDER_NAME = "MERCADO_PAGO";

    private final UserRepositoryPort userRepository;
    private final SubscriptionRepositoryPort subscriptionRepository;
    private final ProcessedWebhookEventRepositoryPort processedWebhookEventRepository;
    private final PaymentProviderPort paymentProviderPort;
    private final MercadoPagoProperties mercadoPagoProperties;

    @Override
    @Transactional
    public SubscriptionCheckoutResult startCheckout(StartSubscriptionCheckoutCommand command) {
        User user = userRepository.findByEmail(command.authenticatedEmail())
                .orElseThrow(() -> new UserNotFoundException("User with email " + command.authenticatedEmail() + " not found."));

        subscriptionRepository.findOperationalByUserId(user.getId())
                .ifPresent(existing -> {
                    throw new SubscriptionAlreadyActiveException("User already has an operational subscription.");
                });

        MembershipSubscription subscription = MembershipSubscription.pending(
                user.getId(),
                PROVIDER_NAME,
                resolvePlanCode(command.planCode()),
                mercadoPagoProperties.getDefaultPlanName(),
                mercadoPagoProperties.getTransactionAmount(),
                mercadoPagoProperties.getCurrencyId(),
                user.getEmail().value()
        );

        PaymentProviderPort.ProviderCheckoutSession checkoutSession = paymentProviderPort.createSubscription(
                new PaymentProviderPort.CreateSubscriptionRequest(
                        user.getEmail().value(),
                        mercadoPagoProperties.getDefaultPlanName(),
                        subscription.getExternalReference(),
                        subscription.getAmount(),
                        subscription.getCurrencyId(),
                        mercadoPagoProperties.getFrequency(),
                        mercadoPagoProperties.getFrequencyType(),
                        mercadoPagoProperties.getBackUrl()
                )
        );

        subscription.attachCheckoutSession(
                checkoutSession.providerSubscriptionId(),
                checkoutSession.checkoutUrl(),
                checkoutSession.status()
        );

        MembershipSubscription savedSubscription = subscriptionRepository.save(subscription);
        user.updateSubscription(savedSubscription.getId());
        userRepository.save(user);

        return new SubscriptionCheckoutResult(
                savedSubscription.getId(),
                savedSubscription.getCheckoutUrl(),
                savedSubscription.getProviderReference(),
                savedSubscription.getStatus()
        );
    }

    @Override
    @Transactional
    public void process(ProcessPaymentWebhookCommand command) {
        if (!supportsTopic(command.topic()) || command.dataId() == null || command.dataId().isBlank()) {
            return;
        }

        paymentProviderPort.validateWebhookSignature(command.xSignature(), command.xRequestId(), command.dataId());

        String eventKey = buildEventKey(command);
        if (processedWebhookEventRepository.existsByEventKey(eventKey)) {
            return;
        }

        PaymentProviderPort.ProviderSubscriptionSnapshot snapshot = paymentProviderPort.getSubscription(command.dataId());
        MembershipSubscription subscription = subscriptionRepository.findByProviderReference(snapshot.providerSubscriptionId())
                .orElseThrow(() -> new SubscriptionNotFoundException(
                        "Subscription with provider reference " + snapshot.providerSubscriptionId() + " not found."
                ));

        Instant processedAt = snapshot.updatedAt() != null ? snapshot.updatedAt() : Instant.now();
        subscription.synchronize(
                snapshot.status(),
                snapshot.nextBillingDate(),
                processedAt,
                snapshot.providerSubscriptionId(),
                snapshot.checkoutUrl()
        );
        subscriptionRepository.save(subscription);

        User user = userRepository.findById(subscription.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User with id " + subscription.getUserId() + " not found."));

        if (subscription.getStatus() == SubscriptionStatus.CANCELED || subscription.getStatus() == SubscriptionStatus.EXPIRED) {
            user.updateSubscription(null);
        } else {
            user.updateSubscription(subscription.getId());
        }
        userRepository.save(user);

        processedWebhookEventRepository.save(eventKey, PROVIDER_NAME, command.dataId(), command.action());
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionStatusDto getMySubscriptionStatus(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User with email " + userEmail + " not found."));

        if (user.getCurrentSubscriptionId() == null) {
            return new SubscriptionStatusDto(null, "Sin plan asignado", false, null, null, 0, "");
        }

        MembershipSubscription subscription = subscriptionRepository.findById(user.getCurrentSubscriptionId())
                .orElseThrow(() -> new SubscriptionNotFoundException(
                        "Subscription with id " + user.getCurrentSubscriptionId() + " not found."
                ));

        long monthsActive = 0;
        if (subscription.getActivatedAt() != null) {
            monthsActive = ChronoUnit.MONTHS.between(
                    LocalDate.ofInstant(subscription.getActivatedAt(), ZoneOffset.UTC),
                    LocalDate.ofInstant(Instant.now(), ZoneOffset.UTC)
            );
        }

        return new SubscriptionStatusDto(
                subscription.getId(),
                subscription.getPlanName(),
                subscription.getStatus() == SubscriptionStatus.ACTIVE,
                subscription.getStatus(),
                subscription.getCurrentPeriodEndAt(),
                Math.max(monthsActive, 0),
                "Mercado Pago"
        );
    }

    private boolean supportsTopic(String topic) {
        if (topic == null || topic.isBlank()) {
            return true;
        }
        return topic.toLowerCase().contains("preapproval");
    }

    private String buildEventKey(ProcessPaymentWebhookCommand command) {
        String notificationId = command.notificationId() != null ? command.notificationId() : "na";
        String action = command.action() != null ? command.action() : "na";
        return PROVIDER_NAME + ":" + notificationId + ":" + action + ":" + command.dataId();
    }

    private String resolvePlanCode(String requestedPlanCode) {
        if (requestedPlanCode == null || requestedPlanCode.isBlank()) {
            return mercadoPagoProperties.getDefaultPlanCode();
        }
        return requestedPlanCode.trim();
    }
}

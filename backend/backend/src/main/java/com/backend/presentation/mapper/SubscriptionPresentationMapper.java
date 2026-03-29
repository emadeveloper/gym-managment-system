package com.backend.presentation.mapper;

import com.backend.application.dto.SubscriptionCheckoutResult;
import com.backend.application.dto.SubscriptionStatusDto;
import com.backend.presentation.dto.SubscriptionCheckoutResponse;
import com.backend.presentation.dto.SubscriptionStatusResponse;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionPresentationMapper {

    public SubscriptionCheckoutResponse toResponse(SubscriptionCheckoutResult result) {
        return new SubscriptionCheckoutResponse(
                result.subscriptionId(),
                result.checkoutUrl(),
                result.providerReference(),
                result.status()
        );
    }

    public SubscriptionStatusResponse toResponse(SubscriptionStatusDto dto) {
        return new SubscriptionStatusResponse(
                dto.subscriptionId(),
                dto.plan(),
                dto.active(),
                dto.status(),
                dto.renewalDate(),
                dto.monthsActive(),
                dto.paymentMethod()
        );
    }
}

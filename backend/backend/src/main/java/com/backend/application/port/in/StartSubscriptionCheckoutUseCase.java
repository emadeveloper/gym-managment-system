package com.backend.application.port.in;

import com.backend.application.dto.SubscriptionCheckoutResult;
import com.backend.application.port.in.command.StartSubscriptionCheckoutCommand;

public interface StartSubscriptionCheckoutUseCase {
    SubscriptionCheckoutResult startCheckout(StartSubscriptionCheckoutCommand command);
}

package com.backend.application.port.in;

import com.backend.application.dto.SubscriptionStatusDto;

public interface GetMySubscriptionStatusUseCase {
    SubscriptionStatusDto getMySubscriptionStatus(String userEmail);
}

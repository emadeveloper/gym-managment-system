package com.backend.application.port.out;

import com.backend.domain.model.MembershipSubscription;

import java.util.Optional;
import java.util.UUID;

public interface SubscriptionRepositoryPort {
    MembershipSubscription save(MembershipSubscription subscription);

    Optional<MembershipSubscription> findById(UUID id);

    Optional<MembershipSubscription> findByProviderReference(String providerReference);

    Optional<MembershipSubscription> findOperationalByUserId(UUID userId);
}

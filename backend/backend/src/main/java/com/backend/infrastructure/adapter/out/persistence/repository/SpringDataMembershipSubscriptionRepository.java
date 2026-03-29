package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.MembershipSubscriptionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataMembershipSubscriptionRepository extends JpaRepository<MembershipSubscriptionJpaEntity, UUID> {
    Optional<MembershipSubscriptionJpaEntity> findByProviderReference(String providerReference);

    Optional<MembershipSubscriptionJpaEntity> findFirstByUser_IdAndStatusInOrderByCreatedAtDesc(
            UUID userId,
            Collection<?> statuses
    );
}

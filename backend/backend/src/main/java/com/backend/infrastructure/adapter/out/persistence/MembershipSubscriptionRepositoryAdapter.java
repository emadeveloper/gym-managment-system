package com.backend.infrastructure.adapter.out.persistence;

import com.backend.application.port.out.SubscriptionRepositoryPort;
import com.backend.domain.model.MembershipSubscription;
import com.backend.domain.valueobject.SubscriptionStatus;
import com.backend.infrastructure.adapter.out.persistence.mapper.MembershipSubscriptionPersistenceMapper;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataMembershipSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MembershipSubscriptionRepositoryAdapter implements SubscriptionRepositoryPort {

    private final SpringDataMembershipSubscriptionRepository repository;
    private final MembershipSubscriptionPersistenceMapper mapper;

    @Override
    public MembershipSubscription save(MembershipSubscription subscription) {
        return mapper.toDomain(repository.save(mapper.toEntity(subscription)));
    }

    @Override
    public Optional<MembershipSubscription> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<MembershipSubscription> findByProviderReference(String providerReference) {
        return repository.findByProviderReference(providerReference).map(mapper::toDomain);
    }

    @Override
    public Optional<MembershipSubscription> findOperationalByUserId(UUID userId) {
        return repository.findFirstByUser_IdAndStatusInOrderByCreatedAtDesc(
                userId,
                EnumSet.of(SubscriptionStatus.PENDING, SubscriptionStatus.ACTIVE, SubscriptionStatus.PAST_DUE)
        ).map(mapper::toDomain);
    }
}

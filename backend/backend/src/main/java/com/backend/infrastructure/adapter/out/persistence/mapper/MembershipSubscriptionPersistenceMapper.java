package com.backend.infrastructure.adapter.out.persistence.mapper;

import com.backend.domain.model.MembershipSubscription;
import com.backend.infrastructure.adapter.out.persistence.entity.MembershipSubscriptionJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class MembershipSubscriptionPersistenceMapper {

    public MembershipSubscriptionJpaEntity toEntity(MembershipSubscription subscription) {
        MembershipSubscriptionJpaEntity entity = new MembershipSubscriptionJpaEntity();
        entity.setId(subscription.getId());

        UserJpaEntity user = new UserJpaEntity();
        user.setId(subscription.getUserId());
        entity.setUser(user);

        entity.setProvider(subscription.getProvider());
        entity.setProviderReference(subscription.getProviderReference());
        entity.setExternalReference(subscription.getExternalReference());
        entity.setPlanCode(subscription.getPlanCode());
        entity.setPlanName(subscription.getPlanName());
        entity.setAmount(subscription.getAmount());
        entity.setCurrencyId(subscription.getCurrencyId());
        entity.setPayerEmail(subscription.getPayerEmail());
        entity.setStatus(subscription.getStatus());
        entity.setCheckoutUrl(subscription.getCheckoutUrl());
        entity.setCreatedAt(subscription.getCreatedAt());
        entity.setUpdatedAt(subscription.getUpdatedAt());
        entity.setActivatedAt(subscription.getActivatedAt());
        entity.setCurrentPeriodEndAt(subscription.getCurrentPeriodEndAt());
        entity.setCanceledAt(subscription.getCanceledAt());
        entity.setLastWebhookAt(subscription.getLastWebhookAt());
        return entity;
    }

    public MembershipSubscription toDomain(MembershipSubscriptionJpaEntity entity) {
        return new MembershipSubscription(
                entity.getId(),
                entity.getUser().getId(),
                entity.getProvider(),
                entity.getPlanCode(),
                entity.getPlanName(),
                entity.getAmount(),
                entity.getCurrencyId(),
                entity.getPayerEmail(),
                entity.getExternalReference(),
                entity.getStatus(),
                entity.getProviderReference(),
                entity.getCheckoutUrl(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getActivatedAt(),
                entity.getCurrentPeriodEndAt(),
                entity.getCanceledAt(),
                entity.getLastWebhookAt()
        );
    }
}

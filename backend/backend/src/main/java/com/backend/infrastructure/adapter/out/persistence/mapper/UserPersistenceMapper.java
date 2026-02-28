package com.backend.infrastructure.adapter.out.persistence.mapper;

import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * UserPersistenceMapper
 * Converts between User (Domain) and UserJpaEntity (persistence).
 * Responsible for transformation between layers to keep separation of concerns and maintain clean architecture.
 */
@Component
public class UserPersistenceMapper {

    /**
     * Converts User from Domain to -> UserJpaENtity for persistence
     *
     * @param user User from domain
     * @return Entity JPA ready to store on DB
     */
    public UserJpaEntity toEntity(User user) {
        if (user == null) return null;

        UserJpaEntity entity = new UserJpaEntity();

        // Maintaing relations without inyect or add any repository
        if (user.getTrainerIds() != null && !user.getTrainerIds().isEmpty()) {
            List<UserJpaEntity> trainerProxies = user.getTrainerIds().stream()
                .map(trainerId -> {
                    UserJpaEntity trainerProxy = new UserJpaEntity();
                    trainerProxy.setId(trainerId); // JPA will use this id for the foreign key
                    return trainerProxy;
                })
                .toList();
            entity.setTrainers(trainerProxies);
        }

        // Identity
        entity.setId(user.getId());

        // Personal Data
        entity.setName(user.getName());
        entity.setLastName(user.getLastName());
        entity.setEmail(user.getEmail().value());
        entity.setPassword(user.getPassword());
        entity.setRole(user.getRole());

        // BIOMETRIC DATA
        entity.setAge(user.getAge());
        entity.setHeightCm(user.getHeightCm());
        entity.setWeightKg(user.getWeightKg());

        // CONTACT DATA
        entity.setDni(user.getDni());
        entity.setPhone(user.getPhone());

        // RELATIONS (only IDs)
        entity.setCurrentSubscriptionId(user.getCurrentSubscriptionId());
        // Note: trainerIds persisten on the user_trainers intermediate table

        // TIMESTAMPS
        entity.setCreatedAt(user.getCreatedAt());
        entity.setUpdatedAt(user.getUpdatedAt());
        entity.setLastLoginAt(user.getLastLoginAt());

        // STATE
        entity.setIsActive(user.getIsActive());
        entity.setProfileUpdated(user.getProfileUpdated());

        return entity;
    }

    /**
     * Converts UserJpaEntity from persistence → User from domain
     *
     * @param entity Entity JPA from the DB
     * @return User from domain with all the logic and value objects ready to be used in the domain layer
     */
    public User toDomain(UserJpaEntity entity) {
        if (entity == null) return null;

        // Recreate the value object Email from the string stored in the database
        Email email = new Email(entity.getEmail());

        // Obtain trainerids from relation (if it's loaded)
        List<UUID> trainerIds = new ArrayList<>();
        if (entity.getTrainers() != null && !entity.getTrainers().isEmpty()) {
            entity.getTrainers().forEach(trainer -> trainerIds.add(trainer.getId()));
        }

        // Create domain with all the data from the entity, including value objects and relations
        return new User(
                // IDENTITY
                entity.getId(),

                // PERSONAL DATA
                entity.getName(),
                entity.getLastName(),
                email,
                entity.getPassword(),
                entity.getRole(),

                // BIOMETRIC DATA
                entity.getAge(),
                entity.getHeightCm(),
                entity.getWeightKg(),

                // CONTACT DATA
                entity.getDni(),
                entity.getPhone(),

                // RELATIONS
                entity.getCurrentSubscriptionId(),
                trainerIds,

                // TIMESTAMPS
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getLastLoginAt(),

                // STATE
                entity.getIsActive(),
                entity.getProfileUpdated()
        );
    }
}
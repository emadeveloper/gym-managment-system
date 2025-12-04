package com.backend.infrastructure.adapter.out.persistence.mapper;

import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class UserPersistenceMapper {

    public UserJpaEntity toEntity(User user) {
        UserJpaEntity entity = new UserJpaEntity();

        entity.setId(user.getId());
        entity.setEmail(user.getEmail().value());
        entity.setPassword(user.getPassword());
        entity.setRole(user.getRole());
        entity.setCreatedAt(user.getCreatedAt());
        entity.setUpdatedAt(user.getUpdatedAt());
        entity.setLastLoginAt(user.getLastLoginAt());
        entity.setIsActive(user.getIsActive());
        return entity;
    }

    public User toDomain(UserJpaEntity entity) {
        Email email = new Email(entity.getEmail());


        return new User(
                entity.getId(),
                email,
                entity.getPassword(),
                entity.getRole(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getLastLoginAt(),
                entity.getIsActive()
        );
    }

}

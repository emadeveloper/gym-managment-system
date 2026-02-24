package com.backend.infrastructure.adapter.out.persistence.mapper;

import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * UserPersistenceMapper
 *
 * Convierte entre User (dominio) y UserJpaEntity (persistencia).
 * Responsable de la transformación de datos entre capas.
 */
@Component
public class UserPersistenceMapper {

    /**
     * Convierte User de dominio → UserJpaEntity para persistencia
     *
     * @param user Usuario del dominio
     * @return Entidad JPA lista para guardar en BD
     */
    public UserJpaEntity toEntity(User user) {
        if (user == null) return null;

        UserJpaEntity entity = new UserJpaEntity();

        // IDENTIDAD
        entity.setId(user.getId());

        // DATOS PERSONALES
        entity.setName(user.getName());
        entity.setLastName(user.getLastName());
        entity.setEmail(user.getEmail().value());  // ← Email es value object
        entity.setPassword(user.getPassword());
        entity.setRole(user.getRole());

        // DATOS BIOMÉTRICOS
        entity.setAge(user.getAge());
        entity.setHeightCm(user.getHeightCm());
        entity.setWeightKg(user.getWeightKg());

        // DATOS DE CONTACTO
        entity.setDni(user.getDni());
        entity.setPhone(user.getPhone());

        // RELACIONES (solo IDs)
        entity.setCurrentSubscriptionId(user.getCurrentSubscriptionId());
        // Nota: Los trainerIds se persisten en tabla intermedia user_trainers

        // TIMESTAMPS
        entity.setCreatedAt(user.getCreatedAt());
        entity.setUpdatedAt(user.getUpdatedAt());
        entity.setLastLoginAt(user.getLastLoginAt());

        // ESTADO
        entity.setIsActive(user.getIsActive());
        entity.setProfileUpdated(user.getProfileUpdated());

        return entity;
    }

    /**
     * Convierte UserJpaEntity de persistencia → User de dominio
     *
     * @param entity Entidad JPA de la BD
     * @return Usuario del dominio con toda su lógica
     */
    public User toDomain(UserJpaEntity entity) {
        if (entity == null) return null;

        // Recrear el value object Email
        Email email = new Email(entity.getEmail());

        // Obtener trainerIds desde relación (si está cargada)
        List<UUID> trainerIds = new ArrayList<>();
        if (entity.getTrainers() != null && !entity.getTrainers().isEmpty()) {
            entity.getTrainers().forEach(trainer -> trainerIds.add(trainer.getId()));
        }

        // Crear dominio con todos los datos
        return new User(
                // IDENTIDAD
                entity.getId(),

                // DATOS PERSONALES
                entity.getName(),
                entity.getLastName(),
                email,
                entity.getPassword(),
                entity.getRole(),

                // DATOS BIOMÉTRICOS
                entity.getAge(),
                entity.getHeightCm(),
                entity.getWeightKg(),

                // DATOS DE CONTACTO
                entity.getDni(),
                entity.getPhone(),

                // RELACIONES
                entity.getCurrentSubscriptionId(),
                trainerIds,

                // TIMESTAMPS
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getLastLoginAt(),

                // ESTADO
                entity.getIsActive(),
                entity.getProfileUpdated()
        );
    }
}
package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.NutritionTemplateJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataNutritionTemplateRepository extends JpaRepository<NutritionTemplateJpaEntity, UUID> {

    Optional<NutritionTemplateJpaEntity> findByNameIgnoreCase(String name);
}

package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataNutritionPlanRepository extends JpaRepository<NutritionPlanJpaEntity, UUID> {

    List<NutritionPlanJpaEntity> findAllByAssignedUserEmailIgnoreCase(String email);
}

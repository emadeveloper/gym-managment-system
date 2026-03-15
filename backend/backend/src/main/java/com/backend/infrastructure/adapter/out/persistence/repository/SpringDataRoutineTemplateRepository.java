package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataRoutineTemplateRepository extends JpaRepository<RoutineTemplateJpaEntity, UUID> {

    Optional<RoutineTemplateJpaEntity> findByNameIgnoreCase(String name);
}

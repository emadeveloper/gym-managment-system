package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.ExerciseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataExerciseRepository extends JpaRepository<ExerciseJpaEntity, UUID> {

    boolean existsByNameIgnoreCase(String name);

    Optional<ExerciseJpaEntity> findByNameIgnoreCase(String name);
}

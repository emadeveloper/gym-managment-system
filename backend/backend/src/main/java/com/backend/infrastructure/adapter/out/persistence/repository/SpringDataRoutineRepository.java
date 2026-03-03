package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataRoutineRepository extends JpaRepository<RoutineJpaEntity, UUID> {

    List<RoutineJpaEntity> findAllByAssignedUserEmailIgnoreCase(String email);
}

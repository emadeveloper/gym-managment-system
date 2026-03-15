package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.UserAssignedRoutineExerciseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataUserAssignedRoutineExerciseRepository extends JpaRepository<UserAssignedRoutineExerciseJpaEntity, UUID> {

    List<UserAssignedRoutineExerciseJpaEntity> findByUserAssignedRoutineDayIdOrderByOrderIndexAsc(UUID userAssignedRoutineDayId);

    void deleteByUserAssignedRoutineDayRoutineId(UUID routineId);
}


package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateExerciseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataRoutineTemplateExerciseRepository extends JpaRepository<RoutineTemplateExerciseJpaEntity, UUID> {

    List<RoutineTemplateExerciseJpaEntity> findByRoutineTemplateDayIdOrderByOrderIndexAsc(UUID routineTemplateDayId);

    void deleteByRoutineTemplateDayRoutineTemplateId(UUID routineTemplateId);
}

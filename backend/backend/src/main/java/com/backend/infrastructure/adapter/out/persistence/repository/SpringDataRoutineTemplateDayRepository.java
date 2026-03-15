package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateDayJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataRoutineTemplateDayRepository extends JpaRepository<RoutineTemplateDayJpaEntity, UUID> {

    List<RoutineTemplateDayJpaEntity> findByRoutineTemplateIdOrderByDayOrderAsc(UUID routineTemplateId);

    void deleteByRoutineTemplateId(UUID routineTemplateId);
}

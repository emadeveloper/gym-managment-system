package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.UserAssignedRoutineDayJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataUserAssignedRoutineDayRepository extends JpaRepository<UserAssignedRoutineDayJpaEntity, UUID> {

    List<UserAssignedRoutineDayJpaEntity> findByRoutineIdOrderByDayOrderAsc(UUID routineId);

    void deleteByRoutineId(UUID routineId);
}


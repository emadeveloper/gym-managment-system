package com.backend.application.service;

import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.presentation.dto.RoutineRequest;
import com.backend.presentation.dto.RoutineResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoutineManagementService {

    private final SpringDataRoutineRepository routineRepository;
    private final SpringDataUserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RoutineResponse> getAll() {
        return routineRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RoutineResponse> getForUser(String email) {
        return routineRepository.findAllByAssignedUserEmailIgnoreCase(email)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RoutineResponse create(RoutineRequest request) {
        RoutineJpaEntity entity = new RoutineJpaEntity();
        entity.setId(UUID.randomUUID());
        apply(entity, request);
        return toResponse(routineRepository.save(entity));
    }

    @Transactional
    public RoutineResponse update(UUID id, RoutineRequest request) {
        RoutineJpaEntity entity = routineRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));
        apply(entity, request);
        return toResponse(routineRepository.save(entity));
    }

    private void apply(RoutineJpaEntity entity, RoutineRequest request) {
        UserJpaEntity assignedUser = userRepository.findByEmail(request.assignedMemberEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assigned user not found"));

        entity.setName(request.name().trim());
        entity.setAssignedUser(assignedUser);
        entity.setGoal(request.goal().trim());
        entity.setLevel(request.level().trim());
        entity.setDuration(request.duration().trim());
        entity.setSessionsPerWeek(request.sessionsPerWeek());
        entity.setWeeks(request.weeks());
        entity.setRestWindow(blankToNull(request.restWindow()));
        entity.setStatus(request.status().trim());
        entity.setCoach(request.coach().trim());
        entity.setExercises(request.exercises());
        entity.setFocusArea(request.focusArea().trim());
        entity.setEquipment(request.equipment().trim());
        entity.setNotesTag(blankToNull(request.notesTag()));
        entity.setNotes(blankToNull(request.notes()));
    }

    private RoutineResponse toResponse(RoutineJpaEntity entity) {
        UserJpaEntity assignedUser = entity.getAssignedUser();
        return new RoutineResponse(
                entity.getId(),
                entity.getName(),
                entity.getGoal(),
                entity.getLevel(),
                entity.getDuration(),
                entity.getSessionsPerWeek(),
                entity.getWeeks(),
                entity.getRestWindow(),
                entity.getStatus(),
                entity.getCoach(),
                entity.getExercises(),
                entity.getFocusArea(),
                entity.getEquipment(),
                entity.getNotesTag(),
                entity.getNotes(),
                assignedUser != null ? assignedUser.getEmail() : "",
                assignedUser != null ? resolveName(assignedUser) : ""
        );
    }

    private String resolveName(UserJpaEntity user) {
        if (user.getName() != null && !user.getName().isBlank()) {
            if (user.getLastName() != null && !user.getLastName().isBlank()) {
                return user.getName() + " " + user.getLastName();
            }
            return user.getName();
        }
        return user.getEmail();
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

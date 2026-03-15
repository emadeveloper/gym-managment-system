package com.backend.application.service;

import com.backend.infrastructure.adapter.out.persistence.entity.ExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateDayJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserAssignedRoutineDayJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserAssignedRoutineExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateDayRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserAssignedRoutineDayRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserAssignedRoutineExerciseRepository;
import com.backend.presentation.dto.AssignRoutineTemplateRequest;
import com.backend.presentation.dto.RoutineDayRequest;
import com.backend.presentation.dto.RoutineExerciseRequest;
import com.backend.presentation.dto.RoutineResponse;
import com.backend.presentation.dto.RoutineTemplateDayResponse;
import com.backend.presentation.dto.RoutineTemplateExerciseResponse;
import com.backend.presentation.dto.RoutineTemplateResponse;
import com.backend.presentation.dto.RoutineTemplateUpsertRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoutineTemplateManagementService {

    private final SpringDataRoutineTemplateRepository templateRepository;
    private final SpringDataRoutineTemplateDayRepository templateDayRepository;
    private final SpringDataRoutineTemplateExerciseRepository templateExerciseRepository;
    private final SpringDataRoutineRepository routineRepository;
    private final SpringDataUserRepository userRepository;
    private final SpringDataExerciseRepository exerciseRepository;
    private final SpringDataUserAssignedRoutineDayRepository assignedRoutineDayRepository;
    private final SpringDataUserAssignedRoutineExerciseRepository assignedRoutineExerciseRepository;

    @Transactional(readOnly = true)
    public List<RoutineTemplateResponse> getAll() {
        return templateRepository.findAll().stream()
                .map(this::toTemplateResponse)
                .toList();
    }

    @Transactional
    public RoutineTemplateResponse create(RoutineTemplateUpsertRequest request) {
        RoutineTemplateJpaEntity template = new RoutineTemplateJpaEntity();
        template.setId(UUID.randomUUID());
        applyTemplate(template, request);
        RoutineTemplateJpaEntity savedTemplate = templateRepository.save(template);
        saveTemplateDays(savedTemplate, request.days());
        return toTemplateResponse(savedTemplate);
    }

    @Transactional
    public RoutineTemplateResponse update(UUID id, RoutineTemplateUpsertRequest request) {
        RoutineTemplateJpaEntity template = templateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine template not found"));

        applyTemplate(template, request);
        RoutineTemplateJpaEntity savedTemplate = templateRepository.save(template);
        templateExerciseRepository.deleteByRoutineTemplateDayRoutineTemplateId(id);
        templateDayRepository.deleteByRoutineTemplateId(id);
        saveTemplateDays(savedTemplate, request.days());
        return toTemplateResponse(savedTemplate);
    }

    @Transactional
    public void delete(UUID id) {
        RoutineTemplateJpaEntity template = templateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine template not found"));

        templateExerciseRepository.deleteByRoutineTemplateDayRoutineTemplateId(id);
        templateDayRepository.deleteByRoutineTemplateId(id);
        templateRepository.delete(template);
    }

    @Transactional
    public RoutineTemplateResponse cloneTemplate(UUID templateId, String clonedName) {
        RoutineTemplateJpaEntity source = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine template not found"));

        RoutineTemplateJpaEntity clone = new RoutineTemplateJpaEntity();
        clone.setId(UUID.randomUUID());
        clone.setName(normalizeRequired(clonedName));
        clone.setObjective(source.getObjective());
        clone.setLevel(source.getLevel());
        clone.setDaysPerWeek(source.getDaysPerWeek());
        clone.setEstimatedDurationWeeks(source.getEstimatedDurationWeeks());
        clone.setDescription(source.getDescription());
        clone.setActive(source.getActive());
        RoutineTemplateJpaEntity savedClone = templateRepository.save(clone);

        List<RoutineTemplateDayJpaEntity> sourceDays =
                templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(templateId);
        for (RoutineTemplateDayJpaEntity sourceDay : sourceDays) {
            RoutineTemplateDayJpaEntity dayClone = new RoutineTemplateDayJpaEntity();
            dayClone.setId(UUID.randomUUID());
            dayClone.setRoutineTemplate(savedClone);
            dayClone.setDayOrder(sourceDay.getDayOrder());
            dayClone.setName(sourceDay.getName());
            dayClone.setDescription(sourceDay.getDescription());
            RoutineTemplateDayJpaEntity savedDay = templateDayRepository.save(dayClone);

            List<RoutineTemplateExerciseJpaEntity> sourceExercises =
                    templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(sourceDay.getId());
            for (RoutineTemplateExerciseJpaEntity sourceExercise : sourceExercises) {
                RoutineTemplateExerciseJpaEntity exerciseClone = new RoutineTemplateExerciseJpaEntity();
                exerciseClone.setId(UUID.randomUUID());
                exerciseClone.setRoutineTemplateDay(savedDay);
                exerciseClone.setExercise(sourceExercise.getExercise());
                exerciseClone.setExerciseName(sourceExercise.getExerciseName());
                exerciseClone.setOrderIndex(sourceExercise.getOrderIndex());
                exerciseClone.setTargetSets(sourceExercise.getTargetSets());
                exerciseClone.setTargetReps(sourceExercise.getTargetReps());
                exerciseClone.setTargetRepRangeMin(sourceExercise.getTargetRepRangeMin());
                exerciseClone.setTargetRepRangeMax(sourceExercise.getTargetRepRangeMax());
                exerciseClone.setSuggestedWeight(sourceExercise.getSuggestedWeight());
                exerciseClone.setRestSeconds(sourceExercise.getRestSeconds());
                exerciseClone.setCoachNotes(sourceExercise.getCoachNotes());
                exerciseClone.setThumbnailUrl(sourceExercise.getThumbnailUrl());
                exerciseClone.setVideoUrl(sourceExercise.getVideoUrl());
                exerciseClone.setInstructions(sourceExercise.getInstructions());
                templateExerciseRepository.save(exerciseClone);
            }
        }

        return toTemplateResponse(savedClone);
    }

    @Transactional
    public RoutineResponse assignTemplate(UUID templateId, AssignRoutineTemplateRequest request) {
        RoutineTemplateJpaEntity template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine template not found"));
        UserJpaEntity assignedUser = userRepository.findByEmail(request.assignedMemberEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assigned user not found"));

        RoutineJpaEntity assignment = new RoutineJpaEntity();
        assignment.setId(UUID.randomUUID());
        assignment.setName(template.getName());
        assignment.setAssignedUser(assignedUser);
        assignment.setGoal(template.getObjective());
        assignment.setLevel(template.getLevel());
        assignment.setDuration("60 min");
        assignment.setSessionsPerWeek(template.getDaysPerWeek());
        assignment.setWeeks(template.getEstimatedDurationWeeks() == null ? 4 : template.getEstimatedDurationWeeks());
        assignment.setRestWindow("60-90 seg");
        assignment.setStatus(request.status().trim());
        assignment.setCoach(request.coach().trim());
        assignment.setExercises(countTemplateExercises(templateId));
        assignment.setFocusArea(template.getObjective());
        assignment.setEquipment("Mixto");
        assignment.setNotesTag("Asignada desde plantilla");
        assignment.setNotes(template.getDescription());
        assignment.setSourceTemplateId(template.getId());
        RoutineJpaEntity saved = routineRepository.save(assignment);
        copyTemplateStructureToAssignedRoutine(templateId, saved);

        return new RoutineResponse(
                saved.getId(),
                saved.getName(),
                saved.getGoal(),
                saved.getLevel(),
                saved.getDuration(),
                saved.getSessionsPerWeek(),
                saved.getWeeks(),
                saved.getRestWindow(),
                saved.getStatus(),
                saved.getCoach(),
                saved.getExercises(),
                saved.getFocusArea(),
                saved.getEquipment(),
                saved.getNotesTag(),
                saved.getNotes(),
                assignedUser.getEmail(),
                resolveUserName(assignedUser),
                saved.getSourceTemplateId()
        );
    }

    private void copyTemplateStructureToAssignedRoutine(UUID templateId, RoutineJpaEntity assignedRoutine) {
        List<RoutineTemplateDayJpaEntity> templateDays =
                templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(templateId);

        for (RoutineTemplateDayJpaEntity templateDay : templateDays) {
            UserAssignedRoutineDayJpaEntity assignedDay = new UserAssignedRoutineDayJpaEntity();
            assignedDay.setId(UUID.randomUUID());
            assignedDay.setRoutine(assignedRoutine);
            assignedDay.setDayOrder(templateDay.getDayOrder());
            assignedDay.setName(templateDay.getName());
            assignedDay.setDescription(templateDay.getDescription());
            UserAssignedRoutineDayJpaEntity savedDay = assignedRoutineDayRepository.save(assignedDay);

            List<RoutineTemplateExerciseJpaEntity> templateExercises =
                    templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(templateDay.getId());

            for (RoutineTemplateExerciseJpaEntity templateExercise : templateExercises) {
                UserAssignedRoutineExerciseJpaEntity assignedExercise = new UserAssignedRoutineExerciseJpaEntity();
                assignedExercise.setId(UUID.randomUUID());
                assignedExercise.setUserAssignedRoutineDay(savedDay);
                assignedExercise.setExercise(templateExercise.getExercise());
                assignedExercise.setExerciseName(templateExercise.getExerciseName());
                assignedExercise.setOrderIndex(templateExercise.getOrderIndex());
                assignedExercise.setTargetSets(templateExercise.getTargetSets());
                assignedExercise.setTargetReps(templateExercise.getTargetReps());
                assignedExercise.setTargetRepRangeMin(templateExercise.getTargetRepRangeMin());
                assignedExercise.setTargetRepRangeMax(templateExercise.getTargetRepRangeMax());
                assignedExercise.setSuggestedWeight(templateExercise.getSuggestedWeight());
                assignedExercise.setRestSeconds(templateExercise.getRestSeconds());
                assignedExercise.setCoachNotes(templateExercise.getCoachNotes());
                assignedExercise.setThumbnailUrl(templateExercise.getThumbnailUrl());
                assignedExercise.setVideoUrl(templateExercise.getVideoUrl());
                assignedExercise.setInstructions(templateExercise.getInstructions());
                assignedRoutineExerciseRepository.save(assignedExercise);
            }
        }
    }

    private void applyTemplate(RoutineTemplateJpaEntity template, RoutineTemplateUpsertRequest request) {
        template.setName(normalizeRequired(request.name()));
        template.setObjective(normalizeRequired(request.objective()));
        template.setLevel(normalizeRequired(request.level()));
        template.setDaysPerWeek(request.daysPerWeek());
        template.setEstimatedDurationWeeks(request.estimatedDurationWeeks());
        template.setDescription(blankToNull(request.description()));
        template.setActive(request.active() == null ? Boolean.TRUE : request.active());
    }

    private void saveTemplateDays(RoutineTemplateJpaEntity template, List<RoutineDayRequest> days) {
        if (days == null) {
            return;
        }

        for (RoutineDayRequest dayRequest : days) {
            RoutineTemplateDayJpaEntity dayEntity = new RoutineTemplateDayJpaEntity();
            dayEntity.setId(UUID.randomUUID());
            dayEntity.setRoutineTemplate(template);
            dayEntity.setDayOrder(dayRequest.dayOrder());
            dayEntity.setName(normalizeRequired(dayRequest.name()));
            dayEntity.setDescription(blankToNull(dayRequest.description()));
            RoutineTemplateDayJpaEntity savedDay = templateDayRepository.save(dayEntity);

            if (dayRequest.exercises() == null) {
                continue;
            }

            for (RoutineExerciseRequest exerciseRequest : dayRequest.exercises()) {
                RoutineTemplateExerciseJpaEntity exerciseEntity = new RoutineTemplateExerciseJpaEntity();
                exerciseEntity.setId(UUID.randomUUID());
                exerciseEntity.setRoutineTemplateDay(savedDay);
                exerciseEntity.setExercise(resolveExercise(exerciseRequest.exerciseId()));
                exerciseEntity.setExerciseName(resolveExerciseName(exerciseRequest));
                exerciseEntity.setOrderIndex(exerciseRequest.orderIndex() == null ? 1 : exerciseRequest.orderIndex());
                exerciseEntity.setTargetSets(exerciseRequest.targetSets());
                exerciseEntity.setTargetReps(exerciseRequest.targetReps());
                exerciseEntity.setTargetRepRangeMin(exerciseRequest.targetRepRangeMin());
                exerciseEntity.setTargetRepRangeMax(exerciseRequest.targetRepRangeMax());
                exerciseEntity.setSuggestedWeight(blankToNull(exerciseRequest.suggestedWeight()));
                exerciseEntity.setRestSeconds(exerciseRequest.restSeconds());
                exerciseEntity.setCoachNotes(blankToNull(exerciseRequest.coachNotes()));
                exerciseEntity.setThumbnailUrl(blankToNull(exerciseRequest.thumbnailUrl()));
                exerciseEntity.setVideoUrl(blankToNull(exerciseRequest.videoUrl()));
                exerciseEntity.setInstructions(blankToNull(exerciseRequest.instructions()));
                templateExerciseRepository.save(exerciseEntity);
            }
        }
    }

    private RoutineTemplateResponse toTemplateResponse(RoutineTemplateJpaEntity template) {
        List<RoutineTemplateDayJpaEntity> dayEntities =
                templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(template.getId());
        List<RoutineTemplateDayResponse> days = new ArrayList<>();

        for (RoutineTemplateDayJpaEntity day : dayEntities) {
            List<RoutineTemplateExerciseResponse> exercises =
                    templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(day.getId())
                            .stream()
                            .map(exercise -> new RoutineTemplateExerciseResponse(
                                    exercise.getId(),
                                    exercise.getExercise() != null ? exercise.getExercise().getId() : null,
                                    exercise.getExerciseName(),
                                    exercise.getOrderIndex(),
                                    exercise.getTargetSets(),
                                    exercise.getTargetReps(),
                                    exercise.getTargetRepRangeMin(),
                                    exercise.getTargetRepRangeMax(),
                                    exercise.getSuggestedWeight(),
                                    exercise.getRestSeconds(),
                                    exercise.getCoachNotes(),
                                    exercise.getThumbnailUrl(),
                                    exercise.getVideoUrl(),
                                    exercise.getInstructions()
                            ))
                            .toList();

            days.add(new RoutineTemplateDayResponse(
                    day.getId(),
                    day.getDayOrder(),
                    day.getName(),
                    day.getDescription(),
                    exercises
            ));
        }

        return new RoutineTemplateResponse(
                template.getId(),
                template.getName(),
                template.getObjective(),
                template.getLevel(),
                template.getDaysPerWeek(),
                template.getEstimatedDurationWeeks(),
                template.getDescription(),
                template.getActive(),
                days
        );
    }

    private Integer countTemplateExercises(UUID templateId) {
        return templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(templateId)
                .stream()
                .map(day -> templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(day.getId()).size())
                .reduce(0, Integer::sum);
    }

    private ExerciseJpaEntity resolveExercise(UUID exerciseId) {
        if (exerciseId == null) {
            return null;
        }
        return exerciseRepository.findById(exerciseId).orElse(null);
    }

    private String resolveExerciseName(RoutineExerciseRequest request) {
        if (request.exerciseName() != null && !request.exerciseName().isBlank()) {
            return request.exerciseName().trim();
        }
        ExerciseJpaEntity exercise = resolveExercise(request.exerciseId());
        if (exercise != null) {
            return exercise.getName();
        }
        throw new IllegalArgumentException("Exercise name is required");
    }

    private String resolveUserName(UserJpaEntity user) {
        if (user.getName() != null && !user.getName().isBlank()) {
            if (user.getLastName() != null && !user.getLastName().isBlank()) {
                return user.getName() + " " + user.getLastName();
            }
            return user.getName();
        }
        return user.getEmail();
    }

    private String normalizeRequired(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Required field is missing");
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

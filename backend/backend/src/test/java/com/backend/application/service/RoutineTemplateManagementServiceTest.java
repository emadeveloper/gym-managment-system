package com.backend.application.service;

import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.ExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateDayJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserAssignedRoutineDayJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserAssignedRoutineExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateDayRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserAssignedRoutineDayRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserAssignedRoutineExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.presentation.dto.AssignRoutineTemplateRequest;
import com.backend.presentation.dto.RoutineDayRequest;
import com.backend.presentation.dto.RoutineExerciseRequest;
import com.backend.presentation.dto.RoutineResponse;
import com.backend.presentation.dto.RoutineTemplateResponse;
import com.backend.presentation.dto.RoutineTemplateUpsertRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoutineTemplateManagementServiceTest {

    @Mock
    private SpringDataRoutineTemplateRepository templateRepository;
    @Mock
    private SpringDataRoutineTemplateDayRepository templateDayRepository;
    @Mock
    private SpringDataRoutineTemplateExerciseRepository templateExerciseRepository;
    @Mock
    private SpringDataRoutineRepository routineRepository;
    @Mock
    private SpringDataUserRepository userRepository;
    @Mock
    private SpringDataUserAssignedRoutineDayRepository assignedRoutineDayRepository;
    @Mock
    private SpringDataUserAssignedRoutineExerciseRepository assignedRoutineExerciseRepository;

    @InjectMocks
    private RoutineTemplateManagementService service;

    @Test
    void shouldCloneTemplateWithIndependentNameAndSameStructure() {
        UUID templateId = UUID.randomUUID();
        RoutineTemplateJpaEntity template = new RoutineTemplateJpaEntity();
        template.setId(templateId);
        template.setName("Push Pull Legs Base");
        template.setObjective("Hipertrofia");
        template.setLevel("Intermedio");
        template.setDaysPerWeek(4);
        template.setDescription("Base");
        template.setActive(true);

        RoutineTemplateDayJpaEntity day = new RoutineTemplateDayJpaEntity();
        day.setId(UUID.randomUUID());
        day.setRoutineTemplate(template);
        day.setDayOrder(1);
        day.setName("Dia 1 - Push");

        ExerciseJpaEntity exercise = new ExerciseJpaEntity();
        exercise.setId(UUID.randomUUID());
        exercise.setName("Press banca");

        RoutineTemplateExerciseJpaEntity templateExercise = new RoutineTemplateExerciseJpaEntity();
        templateExercise.setId(UUID.randomUUID());
        templateExercise.setRoutineTemplateDay(day);
        templateExercise.setExercise(exercise);
        templateExercise.setOrderIndex(1);
        templateExercise.setTargetSets(4);
        templateExercise.setTargetReps(8);

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateRepository.save(any(RoutineTemplateJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(any())).thenReturn(List.of(day));
        when(templateDayRepository.save(any(RoutineTemplateDayJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(any())).thenReturn(List.of(templateExercise));
        when(templateExerciseRepository.save(any(RoutineTemplateExerciseJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RoutineTemplateResponse response = service.cloneTemplate(templateId, "Push Pull Legs Base - Cliente A");

        assertEquals("Push Pull Legs Base - Cliente A", response.name());
        verify(templateDayRepository, atLeastOnce()).save(any(RoutineTemplateDayJpaEntity.class));
        verify(templateExerciseRepository, atLeastOnce()).save(any(RoutineTemplateExerciseJpaEntity.class));
    }

    @Test
    void shouldAssignTemplateToUserAsIndependentRoutine() {
        UUID templateId = UUID.randomUUID();
        RoutineTemplateJpaEntity template = new RoutineTemplateJpaEntity();
        template.setId(templateId);
        template.setName("Full Body Base");
        template.setObjective("Fuerza");
        template.setLevel("Intermedio");
        template.setDaysPerWeek(3);
        template.setDescription("Base fuerza");
        template.setActive(true);

        UserJpaEntity user = new UserJpaEntity();
        user.setId(UUID.randomUUID());
        user.setEmail("member@example.com");
        user.setName("Demo");
        user.setLastName("User");
        user.setPassword("encoded");
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setProfileUpdated(true);

        RoutineTemplateDayJpaEntity day = new RoutineTemplateDayJpaEntity();
        day.setId(UUID.randomUUID());
        day.setRoutineTemplate(template);
        day.setDayOrder(1);
        day.setName("Dia 1");

        RoutineTemplateExerciseJpaEntity templateExercise = new RoutineTemplateExerciseJpaEntity();
        templateExercise.setId(UUID.randomUUID());
        templateExercise.setRoutineTemplateDay(day);
        templateExercise.setExerciseName("Sentadilla trasera");
        templateExercise.setOrderIndex(1);
        templateExercise.setTargetSets(4);
        templateExercise.setTargetReps(6);

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(user));
        when(routineRepository.save(any(RoutineJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(templateId)).thenReturn(List.of(day));
        when(templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(day.getId()))
                .thenReturn(List.of(templateExercise));
        when(assignedRoutineDayRepository.save(any(UserAssignedRoutineDayJpaEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(assignedRoutineExerciseRepository.save(any(UserAssignedRoutineExerciseJpaEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RoutineResponse response = service.assignTemplate(templateId, new AssignRoutineTemplateRequest(
                "member@example.com",
                "Activa",
                "Coach Martin"
        ));

        assertEquals("Full Body Base", response.name());
        assertEquals("member@example.com", response.assignedMemberEmail());

        ArgumentCaptor<RoutineJpaEntity> captor = ArgumentCaptor.forClass(RoutineJpaEntity.class);
        verify(routineRepository).save(captor.capture());
        assertEquals(templateId, captor.getValue().getSourceTemplateId());
        verify(assignedRoutineDayRepository, atLeastOnce()).save(any(UserAssignedRoutineDayJpaEntity.class));
        verify(assignedRoutineExerciseRepository, atLeastOnce()).save(any(UserAssignedRoutineExerciseJpaEntity.class));
    }

    @Test
    void shouldCreateTemplateWithProvidedDaysAndExercises() {
        when(templateRepository.save(any(RoutineTemplateJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(any()))
                .thenReturn(List.of(new RoutineTemplateDayJpaEntity()));
        when(templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(any()))
                .thenReturn(List.of(new RoutineTemplateExerciseJpaEntity()));
        when(templateDayRepository.save(any(RoutineTemplateDayJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateExerciseRepository.save(any(RoutineTemplateExerciseJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RoutineTemplateResponse response = service.create(new RoutineTemplateUpsertRequest(
                "Pecho y Triceps",
                "Hipertrofia",
                "Intermedio",
                4,
                8,
                "Bloque de volumen",
                true,
                List.of(
                        new RoutineDayRequest(
                                1,
                                "Dia 1",
                                "Empuje pesado",
                                List.of(
                                        new RoutineExerciseRequest(
                                                null,
                                                "Press banca",
                                                1,
                                                4,
                                                8,
                                                null,
                                                null,
                                                "80kg",
                                                90,
                                                "Mantener tecnica",
                                                null,
                                                null,
                                                "Escapulas retraidas"
                                        )
                                )
                        )
                )
        ));

        assertEquals("Pecho y Triceps", response.name());
        verify(templateDayRepository, atLeastOnce()).save(any(RoutineTemplateDayJpaEntity.class));
        verify(templateExerciseRepository, atLeastOnce()).save(any(RoutineTemplateExerciseJpaEntity.class));
    }

    @Test
    void shouldUpdateTemplateAndReplaceDaysStructure() {
        UUID templateId = UUID.randomUUID();
        RoutineTemplateJpaEntity existing = new RoutineTemplateJpaEntity();
        existing.setId(templateId);
        existing.setName("Plantilla vieja");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(existing));
        when(templateRepository.save(any(RoutineTemplateJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateDayRepository.save(any(RoutineTemplateDayJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(any())).thenReturn(List.of(new RoutineTemplateDayJpaEntity()));
        when(templateExerciseRepository.findByRoutineTemplateDayIdOrderByOrderIndexAsc(any())).thenReturn(List.of(new RoutineTemplateExerciseJpaEntity()));

        RoutineTemplateResponse response = service.update(templateId, new RoutineTemplateUpsertRequest(
                "Plantilla nueva",
                "Fuerza",
                "Intermedio",
                3,
                6,
                "desc",
                true,
                List.of(
                        new RoutineDayRequest(1, "Dia 1", "Base", List.of())
                )
        ));

        assertEquals("Plantilla nueva", response.name());
        verify(templateExerciseRepository).deleteByRoutineTemplateDayRoutineTemplateId(eq(templateId));
        verify(templateDayRepository).deleteByRoutineTemplateId(eq(templateId));
    }

    @Test
    void shouldDeleteTemplateWithAllChildren() {
        UUID templateId = UUID.randomUUID();
        RoutineTemplateJpaEntity existing = new RoutineTemplateJpaEntity();
        existing.setId(templateId);

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(existing));

        service.delete(templateId);

        verify(templateExerciseRepository).deleteByRoutineTemplateDayRoutineTemplateId(templateId);
        verify(templateDayRepository).deleteByRoutineTemplateId(templateId);
        verify(templateRepository).delete(existing);
    }
}

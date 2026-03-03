package com.backend.application.service;

import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.presentation.dto.RoutineRequest;
import com.backend.presentation.dto.RoutineResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoutineManagementServiceTest {

    @Mock
    private SpringDataRoutineRepository routineRepository;

    @Mock
    private SpringDataUserRepository userRepository;

    @InjectMocks
    private RoutineManagementService service;

    @Test
    void shouldCreateRoutineWhenAssignedUserExists() {
        UserJpaEntity user = buildUser("juan@example.com", "Juan", "Perez");
        when(userRepository.findByEmail("juan@example.com")).thenReturn(Optional.of(user));
        when(routineRepository.save(any(RoutineJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RoutineResponse response = service.create(new RoutineRequest(
                "Fuerza Base",
                "juan@example.com",
                "Fuerza",
                "Intermedio",
                "60 min",
                3,
                6,
                "90 seg",
                "Activa",
                "Coach A",
                8,
                "Full body",
                "Barra",
                "Base",
                "Notas"
        ));

        assertEquals("Fuerza Base", response.name());
        assertEquals("juan@example.com", response.assignedMemberEmail());
        assertEquals("Juan Perez", response.assignedMemberName());

        ArgumentCaptor<RoutineJpaEntity> captor = ArgumentCaptor.forClass(RoutineJpaEntity.class);
        verify(routineRepository).save(captor.capture());
        assertEquals("Fuerza Base", captor.getValue().getName());
        assertEquals(user, captor.getValue().getAssignedUser());
    }

    @Test
    void shouldRejectRoutineWhenAssignedUserDoesNotExist() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(
                new RoutineRequest(
                        "Fuerza Base",
                        "missing@example.com",
                        "Fuerza",
                        "Intermedio",
                        "60 min",
                        3,
                        6,
                        null,
                        "Activa",
                        "Coach A",
                        8,
                        "Full body",
                        "Barra",
                        null,
                        null
                )
        ));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void shouldReturnOnlyAssignedRoutinesForUser() {
        UserJpaEntity user = buildUser("juan@example.com", "Juan", "Perez");
        RoutineJpaEntity routine = new RoutineJpaEntity();
        routine.setId(UUID.randomUUID());
        routine.setName("Fuerza Base");
        routine.setGoal("Fuerza");
        routine.setLevel("Intermedio");
        routine.setDuration("60 min");
        routine.setSessionsPerWeek(3);
        routine.setWeeks(6);
        routine.setStatus("Activa");
        routine.setCoach("Coach A");
        routine.setExercises(8);
        routine.setFocusArea("Full body");
        routine.setEquipment("Barra");
        routine.setAssignedUser(user);

        when(routineRepository.findAllByAssignedUserEmailIgnoreCase("juan@example.com"))
                .thenReturn(List.of(routine));

        List<RoutineResponse> response = service.getForUser("juan@example.com");

        assertEquals(1, response.size());
        assertEquals("Juan Perez", response.get(0).assignedMemberName());
    }

    private UserJpaEntity buildUser(String email, String name, String lastName) {
        UserJpaEntity user = new UserJpaEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setName(name);
        user.setLastName(lastName);
        user.setPassword("encoded");
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setProfileUpdated(false);
        return user;
    }
}

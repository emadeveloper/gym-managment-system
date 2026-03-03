package com.backend.application.service;

import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionPlanRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.presentation.dto.NutritionPlanRequest;
import com.backend.presentation.dto.NutritionPlanResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NutritionPlanManagementServiceTest {

    @Mock
    private SpringDataNutritionPlanRepository nutritionPlanRepository;

    @Mock
    private SpringDataUserRepository userRepository;

    @InjectMocks
    private NutritionPlanManagementService service;

    @Test
    void shouldCreatePlanWhenAssignedUserExists() {
        UserJpaEntity user = buildUser("juan@example.com", "Juan", "Perez");
        when(userRepository.findByEmail("juan@example.com")).thenReturn(Optional.of(user));
        when(nutritionPlanRepository.save(any(NutritionPlanJpaEntity.class))).thenAnswer(invocation -> {
            NutritionPlanJpaEntity entity = invocation.getArgument(0);
            entity.setCreatedAt(Instant.parse("2026-03-03T10:15:30Z"));
            return entity;
        });

        NutritionPlanResponse response = service.create(new NutritionPlanRequest(
                "Deficit",
                "juan@example.com",
                "Pérdida de grasa",
                "Personalizado",
                2200,
                160,
                220,
                70,
                "2026-05-12",
                "Activo",
                "Moderado",
                "Sin gluten",
                "Creatina",
                "Tomar agua"
        ));

        assertEquals("Deficit", response.name());
        assertEquals("2026-05-12", response.reviewDate());
        assertEquals("Juan Perez", response.assignedMemberName());
        assertEquals("2026-03-03T10:15:30Z", response.createdDate());

        ArgumentCaptor<NutritionPlanJpaEntity> captor = ArgumentCaptor.forClass(NutritionPlanJpaEntity.class);
        verify(nutritionPlanRepository).save(captor.capture());
        assertEquals(LocalDate.parse("2026-05-12"), captor.getValue().getReviewDate());
    }

    @Test
    void shouldRejectInvalidReviewDate() {
        UserJpaEntity user = buildUser("juan@example.com", "Juan", "Perez");
        when(userRepository.findByEmail("juan@example.com")).thenReturn(Optional.of(user));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(
                new NutritionPlanRequest(
                        "Deficit",
                        "juan@example.com",
                        "Pérdida de grasa",
                        "Personalizado",
                        2200,
                        160,
                        220,
                        70,
                        "12/05/2026",
                        "Activo",
                        "Moderado",
                        null,
                        null,
                        null
                )
        ));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void shouldReturnPlansForAssignedUser() {
        UserJpaEntity user = buildUser("juan@example.com", "Juan", "Perez");
        NutritionPlanJpaEntity plan = new NutritionPlanJpaEntity();
        plan.setId(UUID.randomUUID());
        plan.setName("Deficit");
        plan.setGoal("Pérdida de grasa");
        plan.setCalories(2200);
        plan.setType("Personalizado");
        plan.setStatus("Activo");
        plan.setActivityLevel("Moderado");
        plan.setProtein(160);
        plan.setCarbs(220);
        plan.setFat(70);
        plan.setAssignedUser(user);
        plan.setCreatedAt(Instant.parse("2026-03-03T10:15:30Z"));

        when(nutritionPlanRepository.findAllByAssignedUserEmailIgnoreCase("juan@example.com"))
                .thenReturn(List.of(plan));

        List<NutritionPlanResponse> response = service.getForUser("juan@example.com");

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

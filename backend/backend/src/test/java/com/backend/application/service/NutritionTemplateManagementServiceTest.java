package com.backend.application.service;

import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.NutritionTemplateJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionPlanRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionTemplateRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.presentation.dto.AssignNutritionTemplateRequest;
import com.backend.presentation.dto.NutritionPlanResponse;
import com.backend.presentation.dto.NutritionTemplateResponse;
import com.backend.presentation.dto.NutritionTemplateUpsertRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NutritionTemplateManagementServiceTest {

    @Mock
    private SpringDataNutritionTemplateRepository templateRepository;

    @Mock
    private SpringDataNutritionPlanRepository nutritionPlanRepository;

    @Mock
    private SpringDataUserRepository userRepository;

    @InjectMocks
    private NutritionTemplateManagementService service;

    @Test
    void shouldCreateTemplateWithNormalizedOptionalFields() {
        when(templateRepository.save(any(NutritionTemplateJpaEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NutritionTemplateResponse response = service.create(new NutritionTemplateUpsertRequest(
                "Hipertrofia base",
                "Hipertrofia",
                "Plantilla",
                2850,
                180,
                320,
                75,
                "Alto",
                "Sin lactosa",
                "Creatina",
                "Priorizar adherencia",
                "Bloque de volumen de 8 semanas",
                true
        ));

        assertEquals("Hipertrofia base", response.name());
        assertEquals("Bloque de volumen de 8 semanas", response.description());
        assertTrue(response.active());
    }

    @Test
    void shouldAssignTemplateToUserAsIndependentPlan() {
        UUID templateId = UUID.randomUUID();
        NutritionTemplateJpaEntity template = new NutritionTemplateJpaEntity();
        template.setId(templateId);
        template.setName("Definicion base");
        template.setGoal("Pérdida de grasa");
        template.setType("Plantilla");
        template.setCalories(2100);
        template.setProtein(170);
        template.setCarbs(190);
        template.setFat(65);
        template.setActivityLevel("Moderado");
        template.setRestrictions("Sin gluten");
        template.setSupplements("Creatina");
        template.setTips("Sostener pasos diarios");
        template.setDescription("Plantilla para recorte controlado");
        template.setActive(true);

        UserJpaEntity user = buildUser("member@example.com", "Demo", "User");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(user));
        when(nutritionPlanRepository.save(any(NutritionPlanJpaEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NutritionPlanResponse response = service.assignTemplate(templateId, new AssignNutritionTemplateRequest(
                "member@example.com",
                "Activo",
                "2026-06-01"
        ));

        assertEquals("Definicion base", response.name());
        assertEquals("member@example.com", response.assignedMemberEmail());
        assertEquals(templateId, response.sourceTemplateId());

        ArgumentCaptor<NutritionPlanJpaEntity> captor = ArgumentCaptor.forClass(NutritionPlanJpaEntity.class);
        verify(nutritionPlanRepository).save(captor.capture());
        assertEquals(templateId, captor.getValue().getSourceTemplateId());
        assertEquals(LocalDate.parse("2026-06-01"), captor.getValue().getReviewDate());
    }

    @Test
    void shouldReturnAllTemplates() {
        NutritionTemplateJpaEntity first = new NutritionTemplateJpaEntity();
        first.setId(UUID.randomUUID());
        first.setName("Hipertrofia base");
        first.setGoal("Hipertrofia");
        first.setType("Plantilla");
        first.setCalories(2800);
        first.setProtein(180);
        first.setCarbs(320);
        first.setFat(75);
        first.setActivityLevel("Alto");
        first.setActive(true);

        when(templateRepository.findAll()).thenReturn(List.of(first));

        List<NutritionTemplateResponse> response = service.getAll();

        assertEquals(1, response.size());
        assertEquals("Hipertrofia base", response.get(0).name());
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
        user.setProfileUpdated(true);
        return user;
    }
}

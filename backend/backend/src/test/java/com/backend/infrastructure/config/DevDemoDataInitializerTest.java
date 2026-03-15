package com.backend.infrastructure.config;

import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.ExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionPlanRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateDayRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DevDemoDataInitializerTest {

    @Mock
    private SpringDataUserRepository userRepository;

    @Mock
    private SpringDataRoutineRepository routineRepository;

    @Mock
    private SpringDataNutritionPlanRepository nutritionPlanRepository;

    @Mock
    private SpringDataExerciseRepository exerciseRepository;

    @Mock
    private SpringDataRoutineTemplateRepository routineTemplateRepository;

    @Mock
    private SpringDataRoutineTemplateDayRepository routineTemplateDayRepository;

    @Mock
    private SpringDataRoutineTemplateExerciseRepository routineTemplateExerciseRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private DevDemoDataInitializer initializer;

    @BeforeEach
    void setUp() {
        initializer = new DevDemoDataInitializer(
                userRepository,
                routineRepository,
                nutritionPlanRepository,
                exerciseRepository,
                routineTemplateRepository,
                routineTemplateDayRepository,
                routineTemplateExerciseRepository,
                passwordEncoder
        );
    }

    @Test
    void shouldUpdateExistingAdminWithAdminRoleAndDeterministicPassword() throws Exception {
        UserJpaEntity existingAdmin = new UserJpaEntity();
        existingAdmin.setEmail("valentina.rios.admin@laresistencia.dev");
        existingAdmin.setRole(Role.USER);
        existingAdmin.setPassword("legacy-password");

        UserJpaEntity existingDemoUser = new UserJpaEntity();
        existingDemoUser.setEmail("demo.member@laresistencia.dev");

        when(passwordEncoder.encode("AdminValentina123!")).thenReturn("encoded-admin-password");
        when(userRepository.findByEmail("valentina.rios.admin@laresistencia.dev"))
                .thenReturn(Optional.of(existingAdmin));
        when(userRepository.findByEmail("demo.member@laresistencia.dev"))
                .thenReturn(Optional.of(existingDemoUser));
        when(userRepository.save(any(UserJpaEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(exerciseRepository.findByNameIgnoreCase(anyString()))
                .thenReturn(Optional.of(new ExerciseJpaEntity()));
        when(routineTemplateRepository.findByNameIgnoreCase("Plantilla base pecho y triceps"))
                .thenReturn(Optional.of(new RoutineTemplateJpaEntity()));
        when(routineTemplateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(any()))
                .thenReturn(List.of(new com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateDayJpaEntity()));
        when(routineRepository.findAllByAssignedUserEmailIgnoreCase("demo.member@laresistencia.dev"))
                .thenReturn(List.of(new RoutineJpaEntity()));
        when(nutritionPlanRepository.findAllByAssignedUserEmailIgnoreCase("demo.member@laresistencia.dev"))
                .thenReturn(List.of(new NutritionPlanJpaEntity()));

        initializer.run();

        ArgumentCaptor<UserJpaEntity> userCaptor = ArgumentCaptor.forClass(UserJpaEntity.class);
        org.mockito.Mockito.verify(userRepository, org.mockito.Mockito.atLeastOnce()).save(userCaptor.capture());

        UserJpaEntity savedAdmin = userCaptor.getAllValues().stream()
                .filter(user -> "valentina.rios.admin@laresistencia.dev".equalsIgnoreCase(user.getEmail()))
                .findFirst()
                .orElseThrow();

        assertThat(savedAdmin.getRole()).isEqualTo(Role.ADMIN);
        assertThat(savedAdmin.getPassword()).isEqualTo("encoded-admin-password");
        assertThat(savedAdmin.getName()).isEqualTo("Valentina");
        assertThat(savedAdmin.getLastName()).isEqualTo("Rios");
    }
}

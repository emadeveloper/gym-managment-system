package com.backend.infrastructure.config;

import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionPlanRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDemoDataInitializer implements CommandLineRunner {

    private static final UUID DEMO_USER_ID = UUID.fromString("9f4c2ce5-37f1-44f8-8725-c6f1890f7f11");
    private static final String DEMO_USER_EMAIL = "demo.member@laresistencia.dev";
    private static final String DEMO_USER_PASSWORD = "DemoUser123!";
    private static final UUID ADMIN_USER_ID = UUID.fromString("e5dcb1d4-b31f-4e72-b944-f8275f0d3ef7");
    private static final String ADMIN_USER_EMAIL = "valentina.rios.admin@laresistencia.dev";
    private static final String ADMIN_USER_PASSWORD = "AdminValentina123!";
    private static final String DEMO_ROUTINE_NAME = "Pecho y triceps - fuerza progresiva";
    private static final String DEMO_NUTRITION_PLAN_NAME = "Plan nutricional para ganar masa muscular";

    private final SpringDataUserRepository userRepository;
    private final SpringDataRoutineRepository routineRepository;
    private final SpringDataNutritionPlanRepository nutritionPlanRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        ensureAdminUser();
        UserJpaEntity demoUser = ensureDemoUser();
        ensureDemoRoutine(demoUser);
        ensureDemoNutritionPlan(demoUser);
    }

    private UserJpaEntity ensureAdminUser() {
        return userRepository.findByEmail(ADMIN_USER_EMAIL)
                .map(existingUser -> {
                    existingUser.setPassword(passwordEncoder.encode(ADMIN_USER_PASSWORD));
                    existingUser.setRole(Role.ADMIN);
                    existingUser.setName("Valentina");
                    existingUser.setLastName("Rios");
                    existingUser.setIsActive(true);
                    existingUser.setProfileUpdated(true);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    UserJpaEntity adminUser = new UserJpaEntity();
                    adminUser.setId(ADMIN_USER_ID);
                    adminUser.setEmail(ADMIN_USER_EMAIL);
                    adminUser.setPassword(passwordEncoder.encode(ADMIN_USER_PASSWORD));
                    adminUser.setRole(Role.ADMIN);
                    adminUser.setName("Valentina");
                    adminUser.setLastName("Rios");
                    adminUser.setIsActive(true);
                    adminUser.setProfileUpdated(true);
                    return userRepository.save(adminUser);
                });
    }

    private UserJpaEntity ensureDemoUser() {
        return userRepository.findByEmail(DEMO_USER_EMAIL)
                .orElseGet(() -> {
                    UserJpaEntity user = new UserJpaEntity();
                    user.setId(DEMO_USER_ID);
                    user.setEmail(DEMO_USER_EMAIL);
                    user.setPassword(passwordEncoder.encode(DEMO_USER_PASSWORD));
                    user.setRole(Role.USER);
                    user.setName("Demo");
                    user.setLastName("Masa");
                    user.setIsActive(true);
                    user.setProfileUpdated(true);
                    return userRepository.save(user);
                });
    }

    private void ensureDemoRoutine(UserJpaEntity demoUser) {
        boolean routineExists = routineRepository.findAllByAssignedUserEmailIgnoreCase(DEMO_USER_EMAIL)
                .stream()
                .anyMatch(routine -> DEMO_ROUTINE_NAME.equalsIgnoreCase(routine.getName()));

        if (routineExists) {
            return;
        }

        RoutineJpaEntity routine = new RoutineJpaEntity();
        routine.setId(UUID.randomUUID());
        routine.setName(DEMO_ROUTINE_NAME);
        routine.setAssignedUser(demoUser);
        routine.setGoal("Fuerza");
        routine.setLevel("Intermedio");
        routine.setDuration("75 min");
        routine.setSessionsPerWeek(4);
        routine.setWeeks(8);
        routine.setRestWindow("90-120 segundos");
        routine.setStatus("Activa");
        routine.setCoach("Julián Martínez");
        routine.setExercises(5);
        routine.setFocusArea("Pecho y triceps");
        routine.setEquipment("Barra, mancuernas, polea");
        routine.setNotesTag("Sobrecarga progresiva");
        routine.setNotes("Priorizar tecnica estricta. Ultima serie de cada ejercicio en RPE 9.");
        routineRepository.save(routine);
    }

    private void ensureDemoNutritionPlan(UserJpaEntity demoUser) {
        boolean planExists = nutritionPlanRepository.findAllByAssignedUserEmailIgnoreCase(DEMO_USER_EMAIL)
                .stream()
                .anyMatch(plan -> DEMO_NUTRITION_PLAN_NAME.equalsIgnoreCase(plan.getName()));

        if (planExists) {
            return;
        }

        NutritionPlanJpaEntity plan = new NutritionPlanJpaEntity();
        plan.setId(UUID.randomUUID());
        plan.setName(DEMO_NUTRITION_PLAN_NAME);
        plan.setAssignedUser(demoUser);
        plan.setGoal("Hipertrofia");
        plan.setCalories(3150);
        plan.setType("Personalizado");
        plan.setStatus("Activo");
        plan.setReviewDate(LocalDate.now().plusWeeks(4));
        plan.setActivityLevel("Alto");
        plan.setProtein(185);
        plan.setCarbs(395);
        plan.setFat(85);
        plan.setRestrictions("Sin restricciones");
        plan.setSupplements("Creatina 5g diaria, Whey post entrenamiento, Omega-3 2 caps");
        plan.setTips("Hidratarse 3L diarios\nDistribuir carbohidratos alrededor del entrenamiento\nRegistrar peso corporal 2 veces por semana");
        nutritionPlanRepository.save(plan);
    }
}

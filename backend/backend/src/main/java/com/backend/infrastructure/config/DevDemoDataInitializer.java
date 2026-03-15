package com.backend.infrastructure.config;

import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateDayJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.RoutineTemplateJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.ExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionPlanRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateDayRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateExerciseRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRoutineTemplateRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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
    private static final String DEMO_TEMPLATE_NAME = "Plantilla base pecho y triceps";

    private final SpringDataUserRepository userRepository;
    private final SpringDataRoutineRepository routineRepository;
    private final SpringDataNutritionPlanRepository nutritionPlanRepository;
    private final SpringDataExerciseRepository exerciseRepository;
    private final SpringDataRoutineTemplateRepository routineTemplateRepository;
    private final SpringDataRoutineTemplateDayRepository routineTemplateDayRepository;
    private final SpringDataRoutineTemplateExerciseRepository routineTemplateExerciseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        ensureAdminUser();
        UserJpaEntity demoUser = ensureDemoUser();
        List<ExerciseJpaEntity> catalog = ensureExerciseCatalog();
        ensureDemoTemplate(catalog);
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

    private ExerciseJpaEntity ensureExercise(
            String name,
            String muscleGroup,
            String equipment,
            String exerciseType,
            String description,
            String instructions
    ) {
        return exerciseRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    ExerciseJpaEntity exercise = new ExerciseJpaEntity();
                    exercise.setId(UUID.randomUUID());
                    exercise.setName(name);
                    exercise.setSlug(name.toLowerCase().replace(" ", "-"));
                    exercise.setMuscleGroup(muscleGroup);
                    exercise.setEquipment(equipment);
                    exercise.setExerciseType(exerciseType);
                    exercise.setDescription(description);
                    exercise.setInstructions(instructions);
                    exercise.setActive(true);
                    return exerciseRepository.save(exercise);
                });
    }

    private void ensureDemoTemplate(List<ExerciseJpaEntity> catalog) {
        ExerciseJpaEntity firstExercise = catalog.stream()
                .filter(exercise -> "Press banca con barra".equalsIgnoreCase(exercise.getName()))
                .findFirst()
                .orElse(catalog.get(0));
        ExerciseJpaEntity secondExercise = catalog.stream()
                .filter(exercise -> "Fondos en paralelas".equalsIgnoreCase(exercise.getName()))
                .findFirst()
                .orElse(catalog.size() > 1 ? catalog.get(1) : catalog.get(0));

        RoutineTemplateJpaEntity template = routineTemplateRepository.findByNameIgnoreCase(DEMO_TEMPLATE_NAME)
                .orElseGet(() -> {
                    RoutineTemplateJpaEntity newTemplate = new RoutineTemplateJpaEntity();
                    newTemplate.setId(UUID.randomUUID());
                    newTemplate.setName(DEMO_TEMPLATE_NAME);
                    newTemplate.setObjective("Hipertrofia");
                    newTemplate.setLevel("Intermedio");
                    newTemplate.setDaysPerWeek(4);
                    newTemplate.setEstimatedDurationWeeks(8);
                    newTemplate.setDescription("Plantilla de volumen controlado para pecho y triceps.");
                    newTemplate.setActive(true);
                    return routineTemplateRepository.save(newTemplate);
                });

        if (!routineTemplateDayRepository.findByRoutineTemplateIdOrderByDayOrderAsc(template.getId()).isEmpty()) {
            return;
        }

        RoutineTemplateDayJpaEntity day = new RoutineTemplateDayJpaEntity();
        day.setId(UUID.randomUUID());
        day.setRoutineTemplate(template);
        day.setDayOrder(1);
        day.setName("Dia 1 - Pecho y triceps");
        day.setDescription("Enfoque principal de empuje.");
        RoutineTemplateDayJpaEntity savedDay = routineTemplateDayRepository.save(day);

        RoutineTemplateExerciseJpaEntity first = new RoutineTemplateExerciseJpaEntity();
        first.setId(UUID.randomUUID());
        first.setRoutineTemplateDay(savedDay);
        first.setExercise(firstExercise);
        first.setExerciseName(firstExercise.getName());
        first.setOrderIndex(1);
        first.setTargetSets(4);
        first.setTargetReps(8);
        first.setSuggestedWeight("70-80kg");
        first.setRestSeconds(120);
        first.setCoachNotes("Ultima serie en RPE 9.");
        first.setInstructions(firstExercise.getInstructions());
        routineTemplateExerciseRepository.save(first);

        RoutineTemplateExerciseJpaEntity second = new RoutineTemplateExerciseJpaEntity();
        second.setId(UUID.randomUUID());
        second.setRoutineTemplateDay(savedDay);
        second.setExercise(secondExercise);
        second.setExerciseName(secondExercise.getName());
        second.setOrderIndex(2);
        second.setTargetSets(3);
        second.setTargetReps(12);
        second.setSuggestedWeight("Peso corporal + lastre ligero");
        second.setRestSeconds(90);
        second.setCoachNotes("Rango completo y controlado.");
        second.setInstructions(secondExercise.getInstructions());
        routineTemplateExerciseRepository.save(second);
    }

    private List<ExerciseJpaEntity> ensureExerciseCatalog() {
        List<ExerciseSeed> exerciseSeeds = List.of(
                new ExerciseSeed("Press banca con barra", "Pecho", "Barra", "Compuesto", "Empuje horizontal para fuerza.", "Escapulas retraidas y control de barra."),
                new ExerciseSeed("Press inclinado con mancuernas", "Pecho", "Mancuernas", "Compuesto", "Trabajo de pectoral superior.", "Bajada controlada y recorrido completo."),
                new ExerciseSeed("Aperturas en polea", "Pecho", "Polea", "Aislado", "Aislamiento de pectoral.", "Mantener tension en todo el arco."),
                new ExerciseSeed("Dominadas pronas", "Espalda", "Peso corporal", "Compuesto", "Tiron vertical para dorsales.", "Iniciar con retraccion escapular."),
                new ExerciseSeed("Remo con barra", "Espalda", "Barra", "Compuesto", "Tiron horizontal principal.", "Espalda neutra y codos hacia atras."),
                new ExerciseSeed("Jalon al pecho", "Espalda", "Polea", "Compuesto", "Alternativa de traccion vertical.", "No balancear el torso."),
                new ExerciseSeed("Fondos en paralelas", "Triceps", "Peso corporal", "Compuesto", "Trabajo global de triceps.", "Codos hacia atras, rango controlado."),
                new ExerciseSeed("Extension triceps en polea", "Triceps", "Polea", "Aislado", "Aislamiento de triceps.", "Bloquear hombros y extender codos."),
                new ExerciseSeed("Press frances", "Triceps", "Barra", "Aislado", "Extension por encima de la cabeza.", "No abrir codos al subir."),
                new ExerciseSeed("Curl barra recta", "Biceps", "Barra", "Aislado", "Flexion de codo clasica.", "Evitar impulso de cadera."),
                new ExerciseSeed("Curl inclinado mancuernas", "Biceps", "Mancuernas", "Aislado", "Mayor estiramiento del biceps.", "No adelantar hombros."),
                new ExerciseSeed("Curl martillo", "Biceps", "Mancuernas", "Aislado", "Trabajo de braquial y antebrazo.", "Muneca neutra durante todo el gesto."),
                new ExerciseSeed("Sentadilla trasera", "Piernas", "Barra", "Compuesto", "Base de fuerza de tren inferior.", "Rodillas siguen linea de pies."),
                new ExerciseSeed("Prensa inclinada", "Piernas", "Maquina", "Compuesto", "Trabajo global de piernas.", "No despegar cadera del respaldo."),
                new ExerciseSeed("Peso muerto rumano", "Piernas", "Barra", "Compuesto", "Cadena posterior e isquios.", "Cadera atras y espalda neutra."),
                new ExerciseSeed("Hip thrust", "Gluteos", "Barra", "Compuesto", "Extension de cadera para gluteos.", "Pausa en contraccion arriba."),
                new ExerciseSeed("Abduccion en maquina", "Gluteos", "Maquina", "Aislado", "Gluteo medio y estabilidad.", "Movimiento controlado sin rebote."),
                new ExerciseSeed("Elevaciones laterales", "Hombros", "Mancuernas", "Aislado", "Deltoide medio.", "Codos levemente flexionados."),
                new ExerciseSeed("Press militar", "Hombros", "Barra", "Compuesto", "Empuje vertical principal.", "Core firme y recorrido vertical."),
                new ExerciseSeed("Pajaros en banco", "Hombros", "Mancuernas", "Aislado", "Deltoide posterior.", "Subida hasta linea del hombro."),
                new ExerciseSeed("Plancha frontal", "Core", "Peso corporal", "Isometrico", "Estabilidad del tronco.", "Mantener cadera alineada."),
                new ExerciseSeed("Crunch en polea", "Core", "Polea", "Aislado", "Flexion de tronco con carga.", "Cerrar costillas hacia pelvis."),
                new ExerciseSeed("Rueda abdominal", "Core", "Rueda", "Compuesto", "Extension anti-flexion del core.", "No colapsar lumbar."),
                new ExerciseSeed("Gemelos de pie", "Pantorrillas", "Maquina", "Aislado", "Trabajo de soleo y gastrocnemio.", "Pausa en estiramiento abajo."),
                new ExerciseSeed("Gemelos sentado", "Pantorrillas", "Maquina", "Aislado", "Enfoque en soleo.", "Subida explosiva y bajada lenta."),
                new ExerciseSeed("Remo al menton", "Trapecio", "Barra", "Compuesto", "Trapecio superior y deltoide.", "No elevar hombros en exceso."),
                new ExerciseSeed("Encogimientos con mancuernas", "Trapecio", "Mancuernas", "Aislado", "Aislamiento de trapecio.", "Subir hombros en linea vertical."),
                new ExerciseSeed("Face pull", "Espalda", "Polea", "Correctivo", "Salud escapular y hombro posterior.", "Tirar hacia la frente con codos altos."),
                new ExerciseSeed("Farmer walk", "Antebrazos", "Mancuernas", "Compuesto", "Agarre y estabilidad global.", "Caminar con tronco estable."),
                new ExerciseSeed("Curl invertido", "Antebrazos", "Barra", "Aislado", "Fortalece extensores de antebrazo.", "Muneca neutra en todo momento.")
        );

        List<ExerciseJpaEntity> catalog = new ArrayList<>();
        for (ExerciseSeed seed : exerciseSeeds) {
            catalog.add(ensureExercise(
                    seed.name(),
                    seed.muscleGroup(),
                    seed.equipment(),
                    seed.exerciseType(),
                    seed.description(),
                    seed.instructions()
            ));
        }
        return catalog;
    }

    private record ExerciseSeed(
            String name,
            String muscleGroup,
            String equipment,
            String exerciseType,
            String description,
            String instructions
    ) {
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

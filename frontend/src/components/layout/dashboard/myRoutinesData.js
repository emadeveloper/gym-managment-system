const MOCK_WORKOUT_LIBRARY = {
  Fuerza: [
    {
      day: 'Dia 1',
      name: 'Pecho + triceps completo',
      intensity: 'Alta',
      exercises: [
        {
          name: 'Press banca con barra',
          focus: 'Pecho y triceps',
          tempo: '2-0-1',
          sets: [
            { reps: '8', weightKg: 70, rest: '120s', rpe: '8' },
            { reps: '6', weightKg: 75, rest: '120s', rpe: '9' },
            { reps: '6', weightKg: 75, rest: '120s', rpe: '9' },
            { reps: '5', weightKg: 80, rest: '150s', rpe: '9' },
          ],
        },
        {
          name: 'Press inclinado con mancuernas',
          focus: 'Pecho superior',
          tempo: '2-0-2',
          sets: [
            { reps: '12', weightKg: 28, rest: '90s', rpe: '8' },
            { reps: '10', weightKg: 30, rest: '90s', rpe: '8' },
            { reps: '8', weightKg: 32, rest: '90s', rpe: '9' },
          ],
        },
        {
          name: 'Fondos en paralelas lastrados',
          focus: 'Pecho inferior y triceps',
          tempo: '2-1-1',
          sets: [
            { reps: '10', weightKg: 10, rest: '90s', rpe: '8' },
            { reps: '8', weightKg: 15, rest: '90s', rpe: '8' },
            { reps: '8', weightKg: 20, rest: '90s', rpe: '9' },
          ],
        },
        {
          name: 'Press frances con barra EZ',
          focus: 'Triceps',
          tempo: '2-0-2',
          sets: [
            { reps: '12', weightKg: 25, rest: '75s', rpe: '8' },
            { reps: '10', weightKg: 30, rest: '75s', rpe: '8' },
            { reps: '10', weightKg: 30, rest: '75s', rpe: '9' },
          ],
        },
        {
          name: 'Extension de triceps en polea',
          focus: 'Triceps (aislamiento)',
          tempo: '2-1-2',
          sets: [
            { reps: '15', weightKg: 22.5, rest: '60s', rpe: '8' },
            { reps: '12', weightKg: 25, rest: '60s', rpe: '8' },
            { reps: '12', weightKg: 27.5, rest: '60s', rpe: '9' },
          ],
        },
      ],
    },
    {
      day: 'Dia 2',
      name: 'Traccion + posterior',
      intensity: 'Media',
      exercises: [
        {
          name: 'Peso muerto rumano',
          focus: 'Isquios y gluteos',
          tempo: '3-0-1',
          sets: [
            { reps: '10', weightKg: 80, rest: '120s', rpe: '8' },
            { reps: '8', weightKg: 85, rest: '120s', rpe: '8' },
            { reps: '8', weightKg: 85, rest: '120s', rpe: '9' },
          ],
        },
        {
          name: 'Remo con barra',
          focus: 'Espalda media',
          tempo: '2-1-1',
          sets: [
            { reps: '12', weightKg: 55, rest: '90s', rpe: '8' },
            { reps: '10', weightKg: 60, rest: '90s', rpe: '8' },
            { reps: '10', weightKg: 60, rest: '90s', rpe: '9' },
          ],
        },
      ],
    },
  ],
  Hipertrofia: [
    {
      day: 'Dia 1',
      name: 'Torso volumen',
      intensity: 'Media',
      exercises: [
        {
          name: 'Press inclinado con mancuernas',
          focus: 'Pecho superior',
          tempo: '2-0-2',
          sets: [
            { reps: '12', weightKg: 24, rest: '75s', rpe: '8' },
            { reps: '12', weightKg: 24, rest: '75s', rpe: '8' },
            { reps: '10', weightKg: 26, rest: '75s', rpe: '9' },
          ],
        },
        {
          name: 'Jalon al pecho',
          focus: 'Dorsales',
          tempo: '2-1-2',
          sets: [
            { reps: '15', weightKg: 45, rest: '75s', rpe: '8' },
            { reps: '12', weightKg: 50, rest: '75s', rpe: '8' },
            { reps: '10', weightKg: 55, rest: '75s', rpe: '9' },
          ],
        },
      ],
    },
    {
      day: 'Dia 2',
      name: 'Piernas controladas',
      intensity: 'Alta',
      exercises: [
        {
          name: 'Sentadilla libre',
          focus: 'Cuadriceps y gluteos',
          tempo: '3-1-1',
          sets: [
            { reps: '10', weightKg: 80, rest: '120s', rpe: '8' },
            { reps: '8', weightKg: 85, rest: '120s', rpe: '9' },
            { reps: '8', weightKg: 85, rest: '120s', rpe: '9' },
          ],
        },
        {
          name: 'Prensa inclinada',
          focus: 'Cuadriceps',
          tempo: '2-0-2',
          sets: [
            { reps: '15', weightKg: 140, rest: '90s', rpe: '8' },
            { reps: '12', weightKg: 150, rest: '90s', rpe: '8' },
            { reps: '10', weightKg: 160, rest: '90s', rpe: '9' },
          ],
        },
      ],
    },
  ],
};

function parseReps(repsValue) {
  const matched = String(repsValue || '0').match(/\d+/);
  return matched ? Number(matched[0]) : 0;
}

function normalizeSet(setData = {}) {
  return {
    reps: String(setData.reps || setData.repetitions || '10'),
    weightKg: Number(setData.weightKg ?? setData.weight ?? setData.kg ?? 0),
    rest: setData.rest || setData.restSeconds ? `${setData.restSeconds || setData.rest}` : '90s',
    rpe: String(setData.rpe || '8'),
  };
}

function normalizeExercise(exercise = {}) {
  const rawSets = Array.isArray(exercise.sets) ? exercise.sets : [];

  return {
    name: exercise.name || 'Ejercicio sin nombre',
    focus: exercise.focus || exercise.muscleGroup || 'General',
    tempo: exercise.tempo || '2-0-2',
    notes: exercise.notes || '',
    sets: rawSets.length > 0 ? rawSets.map(normalizeSet) : [normalizeSet()],
  };
}

function normalizeBlocks(routine = {}) {
  if (Array.isArray(routine.exercisePlan) && routine.exercisePlan.length > 0) {
    return routine.exercisePlan.map((block, blockIndex) => ({
      day: block.day || `Dia ${blockIndex + 1}`,
      name: block.name || block.title || `Bloque ${blockIndex + 1}`,
      intensity: block.intensity || 'Media',
      exercises: Array.isArray(block.exercises) && block.exercises.length > 0
        ? block.exercises.map(normalizeExercise)
        : [normalizeExercise()],
    }));
  }

  return MOCK_WORKOUT_LIBRARY[routine.goal] || MOCK_WORKOUT_LIBRARY.Hipertrofia;
}

function calculateTonnage(blocks = []) {
  return blocks.reduce(
    (tonnage, block) =>
      tonnage +
      block.exercises.reduce(
        (exerciseTonnage, exercise) =>
          exerciseTonnage +
          exercise.sets.reduce(
            (setTonnage, setData) => setTonnage + parseReps(setData.reps) * Number(setData.weightKg || 0),
            0,
          ),
        0,
      ),
    0,
  );
}

export function buildRoutineViewModel(routines = []) {
  return routines.map((routine) => {
    const blocks = normalizeBlocks(routine);
    const estimatedTonnageKg = calculateTonnage(blocks);
    const routineDescription =
      routine.notes?.trim() ||
      routine.notesTag?.trim() ||
      (routine.focusArea
        ? `Rutina orientada a ${routine.goal?.toLowerCase() || 'rendimiento'}, con foco en ${routine.focusArea.toLowerCase()}.`
        : `Rutina orientada a ${routine.goal?.toLowerCase() || 'rendimiento'} y progreso sostenido.`);

    return {
      id: routine.id || routine.name,
      name: routine.name || 'Rutina asignada',
      status: routine.status || 'Activa',
      goal: routine.goal || 'Rendimiento',
      coach: routine.coach || 'Coach del equipo',
      duration: routine.duration || '60 min',
      sessionsPerWeek: Number(routine.sessionsPerWeek) || 3,
      focusArea: routine.focusArea || routine.goal || 'General',
      routineDescription,
      blocks,
      estimatedTonnageKg,
    };
  });
}

export function buildSessionSummary(routineViewModel) {
  const totalExercises = routineViewModel.blocks.reduce(
    (count, block) => count + block.exercises.length,
    0,
  );

  const totalSets = routineViewModel.blocks.reduce(
    (count, block) =>
      count +
      block.exercises.reduce((exerciseCount, exercise) => exerciseCount + exercise.sets.length, 0),
    0,
  );

  const totalWeight = routineViewModel.blocks.reduce(
    (sum, block) =>
      sum +
      block.exercises.reduce(
        (exerciseSum, exercise) =>
          exerciseSum +
          exercise.sets.reduce((setSum, setData) => setSum + Number(setData.weightKg || 0), 0),
        0,
      ),
    0,
  );

  return {
    totalExercises,
    totalSets,
    averageWeightKg: totalSets > 0 ? Math.round((totalWeight / totalSets) * 10) / 10 : 0,
  };
}

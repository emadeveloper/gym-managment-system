import test from 'node:test';
import assert from 'node:assert/strict';

import { buildRoutineViewModel, buildSessionSummary } from './myRoutinesData.js';

test('buildRoutineViewModel uses backend routine values when exercise plan exists', () => {
  const routines = [
    {
      id: 1,
      name: 'Upper Strength',
      goal: 'Fuerza',
      duration: '70 min',
      sessionsPerWeek: 4,
      status: 'Activa',
      coach: 'Julián',
      focusArea: 'Tren superior',
      exercisePlan: [
        {
          day: 'Día 1',
          name: 'Pecho + Tríceps',
          exercises: [
            {
              name: 'Press banca',
              sets: [
                { reps: '10', weightKg: 60 },
                { reps: '8', weightKg: 65 },
              ],
            },
          ],
        },
      ],
    },
  ];

  const [viewModel] = buildRoutineViewModel(routines);

  assert.equal(viewModel.blocks.length, 1);
  assert.equal(viewModel.blocks[0].exercises[0].name, 'Press banca');
  assert.equal(viewModel.blocks[0].exercises[0].sets[1].weightKg, 65);
});

test('buildRoutineViewModel falls back to mock plan when backend has no detailed exercises', () => {
  const routines = [
    {
      id: 2,
      name: 'Full body',
      goal: 'Hipertrofia',
      duration: '60 min',
      sessionsPerWeek: 3,
      status: 'Activa',
      coach: 'Rocío',
      focusArea: 'General',
      exercises: 8,
    },
  ];

  const [viewModel] = buildRoutineViewModel(routines);

  assert.ok(viewModel.blocks.length > 0);
  assert.ok(viewModel.blocks[0].exercises.length > 0);
  assert.equal(typeof viewModel.estimatedTonnageKg, 'number');
  assert.ok(viewModel.estimatedTonnageKg > 0);
});

test('buildSessionSummary reports total exercises and working sets', () => {
  const [viewModel] = buildRoutineViewModel([
    {
      id: 3,
      name: 'Push Pull Legs',
      goal: 'Fuerza',
      sessionsPerWeek: 5,
      status: 'Activa',
      duration: '75 min',
    },
  ]);

  const summary = buildSessionSummary(viewModel);

  assert.ok(summary.totalExercises > 0);
  assert.ok(summary.totalSets > 0);
  assert.ok(summary.averageWeightKg > 0);
});

import React from 'react';
import { Plus, Save } from 'lucide-react';
import { Card } from '../../../../ui/Card';

export function TemplateBuilder({
  value,
  setValue,
  exerciseLibrary,
  onCancel,
  onSubmit,
  saving,
}) {
  const updateTemplate = (field, nextValue) => {
    setValue((current) => ({ ...current, [field]: nextValue }));
  };

  const updateDay = (dayIndex, field, nextValue) => {
    setValue((current) => {
      const nextDays = [...current.days];
      nextDays[dayIndex] = { ...nextDays[dayIndex], [field]: nextValue };
      return { ...current, days: nextDays };
    });
  };

  const addDay = () => {
    setValue((current) => ({
      ...current,
      days: [
        ...current.days,
        {
          dayOrder: current.days.length + 1,
          name: `Dia ${current.days.length + 1}`,
          description: '',
          exercises: [],
        },
      ],
    }));
  };

  const removeDay = (dayIndex) => {
    setValue((current) => {
      const nextDays = current.days.filter((_, index) => index !== dayIndex);
      return {
        ...current,
        days: nextDays.map((day, index) => ({ ...day, dayOrder: index + 1 })),
      };
    });
  };

  const addExercise = (dayIndex) => {
    setValue((current) => {
      const nextDays = [...current.days];
      const selectedExercise = exerciseLibrary[0] || null;
      nextDays[dayIndex] = {
        ...nextDays[dayIndex],
        exercises: [
          ...nextDays[dayIndex].exercises,
          {
            exerciseId: selectedExercise?.id || null,
            exerciseName: selectedExercise?.name || '',
            orderIndex: nextDays[dayIndex].exercises.length + 1,
            targetSets: 3,
            targetReps: 10,
            targetRepRangeMin: null,
            targetRepRangeMax: null,
            suggestedWeight: '',
            restSeconds: 90,
            coachNotes: '',
            thumbnailPath: selectedExercise?.thumbnailPath || '',
            thumbnailAlt: selectedExercise?.thumbnailAlt || selectedExercise?.name || '',
            videoUrl: selectedExercise?.videoUrl || '',
            instructions: selectedExercise?.instructions || '',
          },
        ],
      };
      return { ...current, days: nextDays };
    });
  };

  const updateExercise = (dayIndex, exerciseIndex, field, nextValue) => {
    setValue((current) => {
      const nextDays = [...current.days];
      const nextExercises = [...nextDays[dayIndex].exercises];
      const currentExercise = nextExercises[exerciseIndex];
      nextExercises[exerciseIndex] = {
        ...currentExercise,
        [field]: nextValue,
      };

      if (field === 'exerciseId') {
        const selected = exerciseLibrary.find((exercise) => exercise.id === nextValue);
        nextExercises[exerciseIndex] = {
          ...nextExercises[exerciseIndex],
          exerciseName: selected?.name || '',
          thumbnailPath: selected?.thumbnailPath || '',
          thumbnailAlt: selected?.thumbnailAlt || selected?.name || '',
          videoUrl: selected?.videoUrl || '',
          instructions: selected?.instructions || '',
        };
      }

      nextDays[dayIndex] = {
        ...nextDays[dayIndex],
        exercises: nextExercises,
      };

      return { ...current, days: nextDays };
    });
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    setValue((current) => {
      const nextDays = [...current.days];
      const nextExercises = nextDays[dayIndex].exercises
        .filter((_, index) => index !== exerciseIndex)
        .map((exercise, index) => ({ ...exercise, orderIndex: index + 1 }));
      nextDays[dayIndex] = {
        ...nextDays[dayIndex],
        exercises: nextExercises,
      };
      return { ...current, days: nextDays };
    });
  };

  return (
    <div className="space-y-5">
      <Card className="border border-gray-800 bg-surface p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Nombre de plantilla</span>
            <input
              value={value.name}
              onChange={(event) => updateTemplate('name', event.target.value)}
              className="h-11 w-full rounded-2xl border border-gray-800 bg-black/30 px-4 text-sm text-gray-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Objetivo</span>
            <input
              value={value.objective}
              onChange={(event) => updateTemplate('objective', event.target.value)}
              className="h-11 w-full rounded-2xl border border-gray-800 bg-black/30 px-4 text-sm text-gray-100"
            />
          </label>
          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Nivel</span>
            <input
              value={value.level}
              onChange={(event) => updateTemplate('level', event.target.value)}
              className="h-11 w-full rounded-2xl border border-gray-800 bg-black/30 px-4 text-sm text-gray-100"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Días por semana</span>
              <input
                type="number"
                min="1"
                value={value.daysPerWeek}
                onChange={(event) => updateTemplate('daysPerWeek', Number(event.target.value))}
                className="h-11 w-full rounded-2xl border border-gray-800 bg-black/30 px-4 text-sm text-gray-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Duración (semanas)</span>
              <input
                type="number"
                min="1"
                value={value.estimatedDurationWeeks}
                onChange={(event) => updateTemplate('estimatedDurationWeeks', Number(event.target.value))}
                className="h-11 w-full rounded-2xl border border-gray-800 bg-black/30 px-4 text-sm text-gray-100"
              />
            </label>
          </div>
        </div>
        <label className="mt-4 block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Descripción operativa</span>
          <textarea
            value={value.description}
            onChange={(event) => updateTemplate('description', event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-100"
          />
        </label>
      </Card>

      {value.days.map((day, dayIndex) => (
        <Card key={`${day.name}-${dayIndex}`} className="border border-gray-800 bg-surface p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Nombre del día</span>
                <input
                  value={day.name}
                  onChange={(event) => updateDay(dayIndex, 'name', event.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Descripción del día</span>
                <input
                  value={day.description || ''}
                  onChange={(event) => updateDay(dayIndex, 'description', event.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addExercise(dayIndex)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white"
              >
                <Plus className="mr-1 h-4 w-4" /> Ejercicio
              </button>
              {value.days.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-300"
                >
                  Eliminar día
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {day.exercises.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-800 bg-black/20 px-4 py-5 text-center text-sm text-gray-400">
                Todavía no hay ejercicios en este día.
              </div>
            ) : null}

            {day.exercises.map((exercise, exerciseIndex) => (
              <div
                key={`${exercise.exerciseName}-${exerciseIndex}`}
                className="rounded-2xl border border-gray-800 bg-surface-light p-4"
              >
                <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                  <label className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Ejercicio</span>
                    <select
                      value={exercise.exerciseId || ''}
                      onChange={(event) =>
                        updateExercise(dayIndex, exerciseIndex, 'exerciseId', event.target.value || null)
                      }
                      className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                    >
                      <option value="">Ejercicio manual</option>
                      {exerciseLibrary.map((libraryExercise) => (
                        <option key={libraryExercise.id} value={libraryExercise.id}>
                          {libraryExercise.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Series</span>
                    <input
                      value={exercise.targetSets || ''}
                      onChange={(event) =>
                        updateExercise(dayIndex, exerciseIndex, 'targetSets', Number(event.target.value) || null)
                      }
                      className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Repeticiones</span>
                    <input
                      value={exercise.targetReps || ''}
                      onChange={(event) =>
                        updateExercise(dayIndex, exerciseIndex, 'targetReps', Number(event.target.value) || null)
                      }
                      className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Descanso (seg)</span>
                    <input
                      value={exercise.restSeconds || ''}
                      onChange={(event) =>
                        updateExercise(dayIndex, exerciseIndex, 'restSeconds', Number(event.target.value) || null)
                      }
                      className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                    />
                  </label>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                  <label className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Peso sugerido</span>
                    <input
                      value={exercise.suggestedWeight || ''}
                      onChange={(event) =>
                        updateExercise(dayIndex, exerciseIndex, 'suggestedWeight', event.target.value)
                      }
                      className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Nota del coach</span>
                    <input
                      value={exercise.coachNotes || ''}
                      onChange={(event) =>
                        updateExercise(dayIndex, exerciseIndex, 'coachNotes', event.target.value)
                      }
                      className="h-10 w-full rounded-xl border border-gray-800 bg-black/30 px-3 text-sm text-gray-100"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => removeExercise(dayIndex, exerciseIndex)}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-300"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={addDay}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300"
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar día
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60"
          >
            <Save className="mr-2 h-4 w-4" /> Guardar plantilla
          </button>
        </div>
      </div>
    </div>
  );
}

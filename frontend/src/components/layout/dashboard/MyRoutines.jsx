import React, { useMemo, useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import {
  BarChart3,
  CalendarClock,
  ClipboardPenLine,
  Dumbbell,
  Gauge,
  ShieldCheck,
  TimerReset,
  UserRound,
  Weight,
} from 'lucide-react';
import { useGymData } from '../../../context/GymDataContext';
import { buildRoutineViewModel, buildSessionSummary } from './myRoutinesData';

const FEELING_OPTIONS = [
  { id: 'excellent', label: 'Excelente', tone: 'border-emerald-500/40 text-emerald-300' },
  { id: 'solid', label: 'Cumpli objetivo', tone: 'border-primary/50 text-primary' },
  { id: 'tough', label: 'Duro pero completo', tone: 'border-amber-500/40 text-amber-300' },
  { id: 'rough', label: 'Dia pesado', tone: 'border-orange-500/40 text-orange-300' },
];

function SummaryMetric({ icon, label, value }) {
  const iconElement = icon
    ? React.createElement(icon, { className: 'h-4 w-4 text-primary', 'aria-hidden': 'true' })
    : null;

  return (
    <div className="rounded-3xl border border-gray-800 bg-black/25 p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-gray-400">
        {iconElement}
        {label}
      </div>
      <p className="mt-3 text-2xl font-heading font-bold text-white">{value}</p>
    </div>
  );
}

function ExerciseCard({ exercise, exerciseIndex }) {
  return (
    <article className="rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
            Ejercicio {exerciseIndex + 1}
          </p>
          <h4 className="mt-1 text-base font-heading font-bold text-white sm:text-lg">
            {exercise.name}
          </h4>
        </div>
        <div className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">
          {exercise.focus}
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.12em] text-gray-500">
              <th className="px-2 py-2 font-semibold">Serie</th>
              <th className="px-2 py-2 font-semibold">Reps</th>
              <th className="px-2 py-2 font-semibold">Peso</th>
              <th className="px-2 py-2 font-semibold">Descanso</th>
              <th className="px-2 py-2 font-semibold">RPE</th>
            </tr>
          </thead>
          <tbody>
            {exercise.sets.map((setData, setIndex) => (
              <tr key={`${exercise.name}-${setIndex}`} className="border-t border-gray-800 text-gray-200">
                <td className="px-2 py-3 font-semibold">#{setIndex + 1}</td>
                <td className="px-2 py-3">{setData.reps}</td>
                <td className="px-2 py-3">{setData.weightKg} kg</td>
                <td className="px-2 py-3">{setData.rest}</td>
                <td className="px-2 py-3">{setData.rpe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.1em] text-gray-500">
        Tempo sugerido: <span className="text-gray-300">{exercise.tempo}</span>
      </p>
    </article>
  );
}

const MyRoutines = ({ user }) => {
  const { getAssignedRoutinesForUser } = useGymData();
  const routines = getAssignedRoutinesForUser(user?.email);
  const routineViewModels = useMemo(() => buildRoutineViewModel(routines), [routines]);
  const [selectedRoutineId, setSelectedRoutineId] = useState(routineViewModels[0]?.id || null);
  const [sessionFeeling, setSessionFeeling] = useState('solid');
  const [sessionNotes, setSessionNotes] = useState('');

  const selectedRoutine =
    routineViewModels.find((routine) => routine.id === selectedRoutineId) || routineViewModels[0];
  const summary = selectedRoutine ? buildSessionSummary(selectedRoutine) : null;

  if (!selectedRoutine) {
    return (
      <Card className="border border-gray-800 bg-surface text-center">
        <h3 className="text-xl font-heading font-bold text-white">Todavia no tienes rutina asignada</h3>
        <p className="mt-3 text-sm text-gray-400">
          Cuando el equipo cargue tu plan desde backend, vas a ver ejercicios, series y cargas aca.
        </p>
        <Button className="mt-6 w-full text-sm uppercase font-heading py-3">Solicitar rutina</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[linear-gradient(120deg,#0f1115_0%,#161a21_60%,#1d1010_100%)] p-5 sm:p-7 lg:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Mi plan de entrenamiento</p>
              <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-white sm:text-4xl">
                {selectedRoutine.name}
              </h1>
              <p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">
                Vista completa de ejercicios, series, repeticiones y peso por serie. Esta vista consume la data
                del backend y, cuando no hay detalle cargado, muestra un mock para validar la interfaz en todos
                los dispositivos.
              </p>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-primary/10 p-4 text-primary">
              <Dumbbell className="h-7 w-7" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryMetric icon={CalendarClock} label="Frecuencia" value={`${selectedRoutine.sessionsPerWeek} dias`} />
            <SummaryMetric icon={TimerReset} label="Duracion" value={selectedRoutine.duration} />
            <SummaryMetric icon={BarChart3} label="Ejercicios" value={summary.totalExercises} />
            <SummaryMetric icon={Weight} label="Tonelaje estimado" value={`${selectedRoutine.estimatedTonnageKg} kg`} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-800 bg-surface p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Rutinas asignadas</p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {routineViewModels.map((routine) => {
            const isSelected = routine.id === selectedRoutine.id;
            return (
              <button
                key={routine.id}
                type="button"
                onClick={() => setSelectedRoutineId(routine.id)}
                className={`min-h-11 shrink-0 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-primary/60 bg-primary/10 text-white'
                    : 'border-gray-700 bg-black/25 text-gray-300 hover:border-primary/40 hover:text-white'
                }`}
              >
                <p className="text-sm font-semibold">{routine.name}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-gray-400">{routine.goal}</p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="space-y-5">
        {selectedRoutine.blocks.map((block, blockIndex) => (
          <section key={`${block.day}-${blockIndex}`} className="rounded-3xl border border-gray-800 bg-surface p-4 sm:p-6">
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{block.day}</p>
                <h3 className="mt-2 text-xl font-heading font-bold text-white">{block.name}</h3>
              </div>
              <span className="rounded-full border border-gray-700 px-3 py-1 text-xs uppercase tracking-[0.12em] text-gray-300">
                Intensidad: {block.intensity}
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {block.exercises.map((exercise, exerciseIndex) => (
                <ExerciseCard key={`${exercise.name}-${exerciseIndex}`} exercise={exercise} exerciseIndex={exerciseIndex} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Registro rapido post entrenamiento</p>
            <h3 className="mt-2 text-xl font-heading font-bold text-white">Como te fue hoy</h3>
          </div>
          <ClipboardPenLine className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-gray-800 bg-surface-light p-4 lg:col-span-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-gray-400">
              <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
              Estado de la sesion
            </div>
            <div className="space-y-2">
              {FEELING_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSessionFeeling(option.id)}
                  className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors ${
                    sessionFeeling === option.id
                      ? `${option.tone} bg-black/25`
                      : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {option.label}
                  <Gauge className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-surface-light p-4 lg:col-span-2">
            <label
              htmlFor="session-notes"
              className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-gray-400"
            >
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Comentario del entrenamiento
            </label>
            <textarea
              id="session-notes"
              value={sessionNotes}
              onChange={(event) => setSessionNotes(event.target.value)}
              placeholder="Ejemplo: Dormi poco pero complete todas las series. En la ultima serie de sentadilla baje 5kg para mantener tecnica."
              rows={6}
              className="w-full rounded-2xl border border-gray-700 bg-black/25 px-4 py-3 text-sm leading-6 text-gray-200 outline-none transition-colors placeholder:text-gray-500 focus:border-primary/60"
            />
            <p className="mt-3 text-xs text-gray-500">
              Placeholder local. Luego se conecta al endpoint de feedback diario.
            </p>
            <Button className="mt-4 min-h-11 w-full text-sm uppercase font-heading py-3 sm:w-auto">
              Guardar registro (proximamente)
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryMetric icon={BarChart3} label="Series totales" value={summary.totalSets} />
          <SummaryMetric icon={Weight} label="Peso promedio" value={`${summary.averageWeightKg} kg`} />
          <SummaryMetric icon={CalendarClock} label="Estado rutina" value={selectedRoutine.status} />
          <SummaryMetric icon={UserRound} label="Coach" value={selectedRoutine.coach} />
        </div>
      </Card>
    </div>
  );
};

export default MyRoutines;

import React from 'react';
import { BookOpen, Dumbbell, Save, Search, Trash2, UserRound } from 'lucide-react';
import { Card } from '../../../../ui/Card';
import { ExerciseThumbnail } from './ExerciseThumbnail';

function LibrarySummaryCards({ totals }) {
  const cards = [
    { label: 'Plantillas', value: totals.templates, icon: BookOpen },
    { label: 'Biblioteca de ejercicios', value: totals.exercises, icon: Dumbbell },
    { label: 'Rutinas asignadas', value: totals.assigned, icon: UserRound },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="border border-gray-800 bg-surface p-4 text-center">
            <Icon className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-heading font-bold text-white">{card.value}</p>
          </Card>
        );
      })}
    </section>
  );
}

function ExerciseListSection({
  exerciseSearch,
  setExerciseSearch,
  exerciseFilter,
  setExerciseFilter,
  muscleGroups,
  pagedExercises,
  isLoadingExercises,
  exercisePage,
  setExercisePage,
  onEditExercise,
  openConfirmDialog,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-heading font-semibold uppercase tracking-[0.12em] text-white pb-4">
        Biblioteca de Ejercicios
      </h2>

      <Card className="border border-gray-800 bg-surface p-5">
        <h3 className="text-center text-lg font-heading font-semibold uppercase tracking-[0.12em] text-white">
          Ejercicios Creados
        </h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_220px]">
          <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={exerciseSearch}
              onChange={(event) => {
                setExerciseSearch(event.target.value);
                setExercisePage(0);
              }}
              placeholder="Buscar por nombre, grupo muscular o equipamiento"
              className="w-full bg-transparent text-sm text-gray-200"
            />
          </label>
          <select
            value={exerciseFilter}
            onChange={(event) => {
              setExerciseFilter(event.target.value);
              setExercisePage(0);
            }}
            className="h-11 rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          >
            <option value="">Todos los grupos</option>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {pagedExercises.content.map((exercise) => (
          <Card key={exercise.id} className="overflow-hidden border border-gray-800 bg-surface p-0">
            <div className="grid min-h-[420px] grid-cols-1 grid-rows-2 md:min-h-[280px] md:grid-cols-2 md:grid-rows-1">
              <div className="h-full min-h-0">
                <ExerciseThumbnail
                  path={exercise.thumbnailPath}
                  alt={exercise.thumbnailAlt}
                  className="h-full w-full rounded-none border-0 border-b border-gray-800 md:border-b-0 md:border-r"
                  imageClassName="aspect-[4/3] md:aspect-auto"
                />
              </div>
              <div className="flex h-full min-h-0 flex-col justify-between p-5 text-center">
                <div>
                  <p className="text-base font-heading font-semibold uppercase text-white">{exercise.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-gray-500">
                    {exercise.muscleGroup} · {exercise.equipment} · {exercise.exerciseType}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-gray-400">{exercise.description}</p>
                  <p className="mt-2 text-xs leading-5 text-gray-500">{exercise.instructions}</p>
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => onEditExercise(exercise)}
                    className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300"
                  >
                    Editar
                  </button>
                  {exercise.videoUrl ? (
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center rounded-xl border border-primary/30 bg-primary/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
                    >
                      Demo
                    </a>
                  ) : null}
                  <button
                    onClick={() =>
                      openConfirmDialog({
                        title: 'Eliminar ejercicio',
                        description: `Vas a eliminar "${exercise.name}" de la biblioteca.`,
                        actionType: 'exercise',
                        targetId: exercise.id,
                      })
                    }
                    className="inline-flex h-9 items-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-300"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isLoadingExercises ? (
        <div className="text-center text-sm text-gray-400">Cargando ejercicios...</div>
      ) : null}

      {pagedExercises.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setExercisePage((current) => Math.max(0, current - 1))}
            disabled={exercisePage === 0}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-800 bg-black/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 disabled:opacity-40"
          >
            Anterior
          </button>
          <p className="text-xs uppercase tracking-[0.12em] text-gray-400">
            Página {exercisePage + 1} de {pagedExercises.totalPages}
          </p>
          <button
            onClick={() =>
              setExercisePage((current) => Math.min(pagedExercises.totalPages - 1, current + 1))
            }
            disabled={exercisePage >= pagedExercises.totalPages - 1}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-800 bg-black/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ExerciseFormSection({
  exerciseFormRef,
  editingExerciseId,
  exerciseDraft,
  setExerciseDraft,
  handleExerciseSubmit,
  isSavingExercise,
  onCancelEditing,
}) {
  return (
    <Card className="border border-gray-800 bg-surface p-5">
      <div ref={exerciseFormRef} />
      <p className="text-center text-xs font-heading uppercase tracking-[0.18em] text-gray-500">Alta / edición de ejercicio</p>
      {editingExerciseId ? (
        <p className="mt-2 text-center text-sm font-semibold text-primary">
          Editando: {exerciseDraft.name || 'Ejercicio'}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Nombre</span>
          <input
            value={exerciseDraft.name}
            onChange={(event) => setExerciseDraft((current) => ({ ...current, name: event.target.value }))}
            className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Grupo muscular</span>
          <input
            value={exerciseDraft.muscleGroup}
            onChange={(event) =>
              setExerciseDraft((current) => ({ ...current, muscleGroup: event.target.value }))
            }
            className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Equipamiento</span>
          <input
            value={exerciseDraft.equipment}
            onChange={(event) =>
              setExerciseDraft((current) => ({ ...current, equipment: event.target.value }))
            }
            className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Tipo de ejercicio</span>
          <input
            value={exerciseDraft.exerciseType}
            onChange={(event) =>
              setExerciseDraft((current) => ({ ...current, exerciseType: event.target.value }))
            }
            className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
        </label>
      </div>
      <label className="mt-3 block space-y-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Descripción breve</span>
        <textarea
          value={exerciseDraft.description}
          onChange={(event) =>
            setExerciseDraft((current) => ({ ...current, description: event.target.value }))
          }
          rows={2}
          className="w-full rounded-2xl border border-gray-800 bg-black/25 px-4 py-3 text-sm text-gray-100"
        />
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Instrucciones / cues</span>
        <textarea
          value={exerciseDraft.instructions}
          onChange={(event) =>
            setExerciseDraft((current) => ({ ...current, instructions: event.target.value }))
          }
          rows={2}
          className="w-full rounded-2xl border border-gray-800 bg-black/25 px-4 py-3 text-sm text-gray-100"
        />
      </label>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Thumbnail path local</span>
          <input
            value={exerciseDraft.thumbnailPath}
            onChange={(event) =>
              setExerciseDraft((current) => ({ ...current, thumbnailPath: event.target.value }))
            }
            className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Thumbnail alt</span>
          <input
            value={exerciseDraft.thumbnailAlt}
            onChange={(event) =>
              setExerciseDraft((current) => ({ ...current, thumbnailAlt: event.target.value }))
            }
            className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
        </label>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Video URL</span>
          <input
            value={exerciseDraft.videoUrl}
            onChange={(event) =>
              setExerciseDraft((current) => ({ ...current, videoUrl: event.target.value }))
            }
            className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
          />
        </label>
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Preview</span>
          <ExerciseThumbnail
            path={exerciseDraft.thumbnailPath}
            alt={exerciseDraft.thumbnailAlt}
            className="h-11 w-full"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleExerciseSubmit}
          disabled={isSavingExercise}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60"
        >
          <Save className="mr-2 h-4 w-4" /> {editingExerciseId ? 'Actualizar' : 'Guardar'} ejercicio
        </button>
        {editingExerciseId ? (
          <button
            onClick={onCancelEditing}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300"
          >
            Cancelar edición
          </button>
        ) : null}
      </div>
    </Card>
  );
}

export function ExerciseLibraryTabContent({
  totals,
  exerciseSearch,
  setExerciseSearch,
  exerciseFilter,
  setExerciseFilter,
  muscleGroups,
  pagedExercises,
  isLoadingExercises,
  exercisePage,
  setExercisePage,
  onEditExercise,
  openConfirmDialog,
  exerciseFormRef,
  editingExerciseId,
  exerciseDraft,
  setExerciseDraft,
  handleExerciseSubmit,
  isSavingExercise,
  onCancelEditing,
}) {
  return (
    <div className="space-y-5">
      <LibrarySummaryCards totals={totals} />

      <ExerciseListSection
        exerciseSearch={exerciseSearch}
        setExerciseSearch={setExerciseSearch}
        exerciseFilter={exerciseFilter}
        setExerciseFilter={setExerciseFilter}
        muscleGroups={muscleGroups}
        pagedExercises={pagedExercises}
        isLoadingExercises={isLoadingExercises}
        exercisePage={exercisePage}
        setExercisePage={setExercisePage}
        onEditExercise={onEditExercise}
        openConfirmDialog={openConfirmDialog}
      />

      <ExerciseFormSection
        exerciseFormRef={exerciseFormRef}
        editingExerciseId={editingExerciseId}
        exerciseDraft={exerciseDraft}
        setExerciseDraft={setExerciseDraft}
        handleExerciseSubmit={handleExerciseSubmit}
        isSavingExercise={isSavingExercise}
        onCancelEditing={onCancelEditing}
      />
    </div>
  );
}

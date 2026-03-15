import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  CalendarClock,
  ClipboardPlus,
  Copy,
  Dumbbell,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
} from 'lucide-react';
import { Card } from '../../../ui/Card';
import { useGymData } from '../../../../context/GymDataContext';
import { useToast } from '../../../../hooks/useToast';
import { exercisesAPI } from '../../../../services/api';

const TABS = [
  { id: 'templates', label: 'Plantillas', icon: ClipboardPlus },
  { id: 'assigned', label: 'Rutinas asignadas', icon: Activity },
  { id: 'library', label: 'Biblioteca de ejercicios', icon: BookOpen },
];

const EMPTY_TEMPLATE = {
  name: '',
  objective: '',
  level: '',
  daysPerWeek: 3,
  estimatedDurationWeeks: 6,
  description: '',
  active: true,
  days: [
    {
      dayOrder: 1,
      name: 'Dia 1',
      description: '',
      exercises: [],
    },
  ],
};

const EMPTY_ASSIGNMENT = {
  templateId: '',
  assignedMemberEmail: '',
  status: 'Activa',
  coach: '',
};

const EMPTY_EXERCISE = {
  name: '',
  muscleGroup: '',
  equipment: '',
  exerciseType: '',
  description: '',
  instructions: '',
  commonMistakes: '',
  thumbnailUrl: '',
  videoUrl: '',
  active: true,
};

function TemplateBuilder({
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
            thumbnailUrl: selectedExercise?.thumbnailUrl || '',
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
          thumbnailUrl: selected?.thumbnailUrl || '',
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

export const RoutinesManagement = () => {
  const toast = useToast();
  const {
    members,
    routines,
    routineTemplates,
    exerciseLibrary,
    createRoutineTemplate,
    cloneRoutineTemplate,
    updateRoutineTemplate,
    deleteRoutineTemplate,
    assignRoutineTemplate,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useGymData();

  const [activeTab, setActiveTab] = useState('templates');
  const [templateSearch, setTemplateSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseFilter, setExerciseFilter] = useState('');
  const [isBuildingTemplate, setIsBuildingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templateDraft, setTemplateDraft] = useState(EMPTY_TEMPLATE);
  const [assignmentDraft, setAssignmentDraft] = useState(EMPTY_ASSIGNMENT);
  const [exerciseDraft, setExerciseDraft] = useState(EMPTY_EXERCISE);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isSavingExercise, setIsSavingExercise] = useState(false);
  const [exercisePage, setExercisePage] = useState(0);
  const [pagedExercises, setPagedExercises] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    description: '',
    actionType: null,
    targetId: null,
  });

  const assignableMembers = useMemo(
    () => members.filter((member) => member.role !== 'ADMIN' && member.status !== 'Inactivo'),
    [members],
  );

  const filteredTemplates = useMemo(() => {
    const term = templateSearch.trim().toLowerCase();
    if (!term) return routineTemplates;
    return routineTemplates.filter((template) =>
      [template.name, template.objective, template.level].join(' ').toLowerCase().includes(term),
    );
  }, [routineTemplates, templateSearch]);

  const filteredAssigned = useMemo(() => {
    const term = assignedSearch.trim().toLowerCase();
    if (!term) return routines;
    return routines.filter((routine) =>
      [routine.name, routine.assignedMemberName, routine.status, routine.goal]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [routines, assignedSearch]);

  const muscleGroups = useMemo(
    () => Array.from(new Set(exerciseLibrary.map((exercise) => exercise.muscleGroup))).filter(Boolean),
    [exerciseLibrary],
  );

  useEffect(() => {
    let active = true;

    async function fetchPagedExercises() {
      if (activeTab !== 'library') {
        return;
      }

      setIsLoadingExercises(true);
      try {
        const response = await exercisesAPI.getPaged({
          page: exercisePage,
          size: 6,
          search: exerciseSearch || undefined,
          muscleGroup: exerciseFilter || undefined,
        });
        if (active) {
          setPagedExercises(response.data);
        }
      } catch {
        if (active) {
          setPagedExercises({ content: [], totalPages: 0, totalElements: 0 });
        }
      } finally {
        if (active) {
          setIsLoadingExercises(false);
        }
      }
    }

    fetchPagedExercises();
    return () => {
      active = false;
    };
  }, [activeTab, exercisePage, exerciseSearch, exerciseFilter, exerciseLibrary.length]);

  const handleTemplateSubmit = async () => {
    if (!templateDraft.name || !templateDraft.objective || !templateDraft.level) {
      toast.info('Completá nombre, objetivo y nivel.', 'Plantilla incompleta');
      return;
    }

    setIsSavingTemplate(true);
    try {
      if (editingTemplateId) {
        await updateRoutineTemplate(editingTemplateId, templateDraft);
      } else {
        await createRoutineTemplate(templateDraft);
      }
      setTemplateDraft(EMPTY_TEMPLATE);
      setIsBuildingTemplate(false);
      setEditingTemplateId(null);
      toast.success(
        editingTemplateId ? 'Plantilla actualizada correctamente.' : 'Plantilla guardada correctamente.',
        'Plantillas',
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo guardar la plantilla.', 'Error');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleEditTemplate = (template) => {
    setEditingTemplateId(template.id);
    setTemplateDraft({
      name: template.name,
      objective: template.objective,
      level: template.level,
      daysPerWeek: template.daysPerWeek,
      estimatedDurationWeeks: template.estimatedDurationWeeks || 6,
      description: template.description || '',
      active: template.active !== false,
      days:
        template.days?.length > 0
          ? template.days.map((day, dayIndex) => ({
              dayOrder: day.dayOrder || dayIndex + 1,
              name: day.name || `Dia ${dayIndex + 1}`,
              description: day.description || '',
              exercises: (day.exercises || []).map((exercise, exerciseIndex) => ({
                exerciseId: exercise.exerciseId || null,
                exerciseName: exercise.exerciseName || '',
                orderIndex: exercise.orderIndex || exerciseIndex + 1,
                targetSets: exercise.targetSets || null,
                targetReps: exercise.targetReps || null,
                targetRepRangeMin: exercise.targetRepRangeMin || null,
                targetRepRangeMax: exercise.targetRepRangeMax || null,
                suggestedWeight: exercise.suggestedWeight || '',
                restSeconds: exercise.restSeconds || null,
                coachNotes: exercise.coachNotes || '',
                thumbnailUrl: exercise.thumbnailUrl || '',
                videoUrl: exercise.videoUrl || '',
                instructions: exercise.instructions || '',
              })),
            }))
          : EMPTY_TEMPLATE.days,
    });
    setIsBuildingTemplate(true);
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteRoutineTemplate(templateId);
      toast.success('Plantilla eliminada.', 'Plantillas');
      if (editingTemplateId === templateId) {
        setEditingTemplateId(null);
        setTemplateDraft(EMPTY_TEMPLATE);
        setIsBuildingTemplate(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo eliminar la plantilla.', 'Error');
    }
  };

  const handleClone = async (template) => {
    try {
      await cloneRoutineTemplate(template.id, `${template.name} - Copia`);
      toast.success('Plantilla clonada correctamente.', 'Plantillas');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo clonar la plantilla.', 'Error');
    }
  };

  const handleAssignTemplate = async () => {
    if (!assignmentDraft.templateId || !assignmentDraft.assignedMemberEmail || !assignmentDraft.coach) {
      toast.info('Seleccioná plantilla, miembro y coach.', 'Asignación incompleta');
      return;
    }

    try {
      await assignRoutineTemplate(assignmentDraft.templateId, {
        assignedMemberEmail: assignmentDraft.assignedMemberEmail,
        status: assignmentDraft.status,
        coach: assignmentDraft.coach,
      });
      setAssignmentDraft(EMPTY_ASSIGNMENT);
      toast.success('Rutina asignada desde plantilla.', 'Asignación exitosa');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo asignar la plantilla.', 'Error');
    }
  };

  const handleExerciseSubmit = async () => {
    if (!exerciseDraft.name || !exerciseDraft.muscleGroup || !exerciseDraft.equipment) {
      toast.info('Completá los datos base del ejercicio.', 'Biblioteca');
      return;
    }

    setIsSavingExercise(true);
    try {
      if (editingExerciseId) {
        await updateExercise(editingExerciseId, exerciseDraft);
        toast.success('Ejercicio actualizado.', 'Biblioteca');
      } else {
        await createExercise(exerciseDraft);
        toast.success('Ejercicio agregado a la biblioteca.', 'Biblioteca');
      }
      setExerciseDraft(EMPTY_EXERCISE);
      setEditingExerciseId(null);
      setExercisePage(0);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo guardar el ejercicio.', 'Error');
    } finally {
      setIsSavingExercise(false);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await deleteExercise(exerciseId);
      toast.success('Ejercicio eliminado de la biblioteca.', 'Biblioteca');
      if (editingExerciseId === exerciseId) {
        setEditingExerciseId(null);
        setExerciseDraft(EMPTY_EXERCISE);
      }
      setExercisePage(0);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo eliminar el ejercicio.', 'Error');
    }
  };

  const openConfirmDialog = ({ title, description, actionType, targetId }) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      actionType,
      targetId,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      title: '',
      description: '',
      actionType: null,
      targetId: null,
    });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.targetId || !confirmDialog.actionType) {
      closeConfirmDialog();
      return;
    }

    if (confirmDialog.actionType === 'template') {
      await handleDeleteTemplate(confirmDialog.targetId);
    }

    if (confirmDialog.actionType === 'exercise') {
      await handleDeleteExercise(confirmDialog.targetId);
    }

    closeConfirmDialog();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">Programación</p>
        <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
          Constructor de Rutinas
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-400 sm:text-base">
          Flujo principal del admin: elegir plantilla, clonar, ajustar y asignar. Las rutinas asignadas
          se mantienen separadas de las plantillas para evitar sobrescribir la base reutilizable.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl border p-4 text-center transition-colors ${
                active
                  ? 'border-primary/40 bg-primary/10 text-white'
                  : 'border-gray-800 bg-surface text-gray-300 hover:border-primary/30 hover:text-white'
              }`}
            >
              <Icon className="mx-auto h-5 w-5" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em]">{tab.label}</p>
            </button>
          );
        })}
      </section>

      {activeTab === 'templates' ? (
        <div className="space-y-4">
          <Card className="border border-gray-800 bg-surface p-5">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  value={templateSearch}
                  onChange={(event) => setTemplateSearch(event.target.value)}
                  placeholder="Buscar plantillas por nombre, objetivo o nivel"
                  className="w-full bg-transparent text-sm text-gray-200"
                />
              </label>
              <button
                onClick={() => {
                  setEditingTemplateId(null);
                  setTemplateDraft(EMPTY_TEMPLATE);
                  setIsBuildingTemplate(true);
                }}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Nueva plantilla
              </button>
            </div>
          </Card>

          {isBuildingTemplate ? (
            <TemplateBuilder
              value={templateDraft}
              setValue={setTemplateDraft}
              exerciseLibrary={exerciseLibrary}
              onCancel={() => {
                setIsBuildingTemplate(false);
                setEditingTemplateId(null);
                setTemplateDraft(EMPTY_TEMPLATE);
              }}
              onSubmit={handleTemplateSubmit}
              saving={isSavingTemplate}
            />
          ) : null}

          <h2 className="text-center text-2xl font-heading font-semibold uppercase tracking-[0.12em] text-white">
            Plantillas Creadas
          </h2>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border border-gray-800 bg-surface p-5 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div>
                    <p className="text-sm font-heading font-semibold uppercase text-white">{template.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                      {template.objective} · {template.level}
                    </p>
                  </div>
                  <span className="rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                    {template.daysPerWeek} días/sem
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-400">{template.description || 'Sin descripción.'}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleClone(template)}
                    className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300"
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" /> Clonar
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      openConfirmDialog({
                        title: 'Eliminar plantilla',
                        description: `Vas a eliminar "${template.name}". Esta acción no se puede deshacer.`,
                        actionType: 'template',
                        targetId: template.id,
                      })
                    }
                    className="inline-flex h-9 items-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-300"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() =>
                      setAssignmentDraft((current) => ({ ...current, templateId: template.id }))
                    }
                    className="inline-flex h-9 items-center rounded-xl border border-primary/30 bg-primary/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
                  >
                    Usar para asignar
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="border border-gray-800 bg-surface p-5">
            <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">Asignar plantilla a usuario</p>
            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <select
                value={assignmentDraft.templateId}
                onChange={(event) =>
                  setAssignmentDraft((current) => ({ ...current, templateId: event.target.value }))
                }
                className="h-11 rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
              >
                <option value="">Seleccionar plantilla</option>
                {routineTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <select
                value={assignmentDraft.assignedMemberEmail}
                onChange={(event) =>
                  setAssignmentDraft((current) => ({ ...current, assignedMemberEmail: event.target.value }))
                }
                className="h-11 rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
              >
                <option value="">Seleccionar usuario</option>
                {assignableMembers.map((member) => (
                  <option key={member.id} value={member.email}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input
                value={assignmentDraft.coach}
                onChange={(event) =>
                  setAssignmentDraft((current) => ({ ...current, coach: event.target.value }))
                }
                placeholder="Coach responsable"
                className="h-11 rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
              />
              <button
                onClick={handleAssignTemplate}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"
              >
                <UserRound className="mr-2 h-4 w-4" /> Asignar ahora
              </button>
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === 'assigned' ? (
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-heading font-semibold uppercase tracking-[0.12em] text-white">
            Rutinas Asignadas
          </h2>
          <Card className="border border-gray-800 bg-surface p-5">
            <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                value={assignedSearch}
                onChange={(event) => setAssignedSearch(event.target.value)}
                placeholder="Buscar por rutina, miembro, estado u objetivo"
                className="w-full bg-transparent text-sm text-gray-200"
              />
            </label>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredAssigned.map((routine) => (
              <Card key={routine.id} className="border border-gray-800 bg-surface p-5 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div>
                    <p className="text-sm font-heading font-semibold uppercase text-white">{routine.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                      {routine.goal} · {routine.level}
                    </p>
                  </div>
                  <span className="rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                    {routine.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm text-gray-300">
                  <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Miembro</p>
                    <p className="mt-1">{routine.assignedMemberName || 'Sin asignar'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Fuente</p>
                    <p className="mt-1">{routine.sourceTemplateId ? 'Plantilla' : 'Manual'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Sesiones</p>
                    <p className="mt-1">{routine.sessionsPerWeek} / semana</p>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Ejercicios</p>
                    <p className="mt-1">{routine.exercises}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === 'library' ? (
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-heading font-semibold uppercase tracking-[0.12em] text-white">
            Biblioteca de Ejercicios
          </h2>
          <Card className="border border-gray-800 bg-surface p-5">
            <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">Alta / edición de ejercicio</p>
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
                <span className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Thumbnail URL</span>
                <input
                  value={exerciseDraft.thumbnailUrl}
                  onChange={(event) =>
                    setExerciseDraft((current) => ({ ...current, thumbnailUrl: event.target.value }))
                  }
                  className="h-11 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100"
                />
              </label>
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
                  onClick={() => {
                    setExerciseDraft(EMPTY_EXERCISE);
                    setEditingExerciseId(null);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300"
                >
                  Cancelar edición
                </button>
              ) : null}
            </div>
          </Card>

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
              <Card key={exercise.id} className="border border-gray-800 bg-surface p-5 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div>
                    <p className="text-sm font-heading font-semibold uppercase text-white">{exercise.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                      {exercise.muscleGroup} · {exercise.equipment} · {exercise.exerciseType}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-400">{exercise.description}</p>
                <p className="mt-2 text-xs text-gray-500">{exercise.instructions}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditingExerciseId(exercise.id);
                      setExerciseDraft({
                        name: exercise.name,
                        muscleGroup: exercise.muscleGroup,
                        equipment: exercise.equipment,
                        exerciseType: exercise.exerciseType,
                        description: exercise.description,
                        instructions: exercise.instructions,
                        commonMistakes: exercise.commonMistakes,
                        thumbnailUrl: exercise.thumbnailUrl,
                        videoUrl: exercise.videoUrl,
                        active: exercise.active,
                      });
                    }}
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
      ) : null}

      {confirmDialog.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-surface p-6 text-center shadow-2xl">
            <h3 className="text-xl font-heading font-semibold uppercase text-white">{confirmDialog.title}</h3>
            <p className="mt-3 text-sm text-gray-400">{confirmDialog.description}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={closeConfirmDialog}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-gray-800 bg-black/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Plantillas',
            value: routineTemplates.length,
            icon: ClipboardPlus,
          },
          {
            label: 'Asignadas',
            value: routines.length,
            icon: UserRound,
          },
          {
            label: 'Ejercicios',
            value: exerciseLibrary.length,
            icon: Dumbbell,
          },
          {
            label: 'Bloques activos',
            value: routines.filter((routine) => routine.status === 'Activa').length,
            icon: CalendarClock,
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border border-gray-800 bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-heading font-bold text-white">{metric.value}</p>
                </div>
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
};

export default RoutinesManagement;

import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, BookOpen, ClipboardPlus } from 'lucide-react';
import { useGymData } from '../../../../context/GymDataContext';
import { useToast } from '../../../../hooks/useToast';
import { exercisesAPI } from '../../../../services/api';
import { AssignedTabContent } from './components/AssignedTabContent';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ExerciseLibraryTabContent } from './components/ExerciseLibraryTabContent';
import { TabsSelector } from './components/TabsSelector';
import { TemplatesTabContent } from './components/TemplatesTabContent';

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
  thumbnailPath: '',
  thumbnailAlt: '',
  videoUrl: '',
  active: true,
};

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
  const deferredTemplateSearch = useDeferredValue(templateSearch);
  const deferredAssignedSearch = useDeferredValue(assignedSearch);
  const deferredExerciseSearch = useDeferredValue(exerciseSearch);
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
  const exerciseFormRef = useRef(null);
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
    const term = deferredTemplateSearch.trim().toLowerCase();
    if (!term) return routineTemplates;

    return routineTemplates.filter((template) =>
      [template.name, template.objective, template.level].join(' ').toLowerCase().includes(term),
    );
  }, [routineTemplates, deferredTemplateSearch]);

  const filteredAssigned = useMemo(() => {
    const term = deferredAssignedSearch.trim().toLowerCase();
    if (!term) return routines;

    return routines.filter((routine) =>
      [routine.name, routine.assignedMemberName, routine.status, routine.goal]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [routines, deferredAssignedSearch]);

  const muscleGroups = useMemo(
    () => Array.from(new Set(exerciseLibrary.map((exercise) => exercise.muscleGroup))).filter(Boolean),
    [exerciseLibrary],
  );

  const librarySummaryTotals = useMemo(
    () => ({
      templates: routineTemplates.length,
      exercises: exerciseLibrary.length,
      assigned: routines.length,
    }),
    [routineTemplates.length, exerciseLibrary.length, routines.length],
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
          search: deferredExerciseSearch || undefined,
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
  }, [activeTab, exercisePage, deferredExerciseSearch, exerciseFilter, exerciseLibrary.length]);

  const handleTemplateSubmit = useCallback(async () => {
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
  }, [templateDraft, editingTemplateId, toast, updateRoutineTemplate, createRoutineTemplate]);

  const handleEditTemplate = useCallback((template) => {
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
                thumbnailPath: exercise.thumbnailPath || '',
                thumbnailAlt: exercise.thumbnailAlt || exercise.exerciseName || '',
                videoUrl: exercise.videoUrl || '',
                instructions: exercise.instructions || '',
              })),
            }))
          : EMPTY_TEMPLATE.days,
    });
    setIsBuildingTemplate(true);
  }, []);

  const handleDeleteTemplate = useCallback(async (templateId) => {
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
  }, [deleteRoutineTemplate, editingTemplateId, toast]);

  const handleClone = useCallback(async (template) => {
    try {
      await cloneRoutineTemplate(template.id, `${template.name} - Copia`);
      toast.success('Plantilla clonada correctamente.', 'Plantillas');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo clonar la plantilla.', 'Error');
    }
  }, [cloneRoutineTemplate, toast]);

  const handleAssignTemplate = useCallback(async () => {
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
  }, [assignmentDraft, assignRoutineTemplate, toast]);

  const handleExerciseSubmit = useCallback(async () => {
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
  }, [exerciseDraft, editingExerciseId, updateExercise, createExercise, toast]);

  const handleDeleteExercise = useCallback(async (exerciseId) => {
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
  }, [deleteExercise, editingExerciseId, toast]);

  const handleEditExercise = useCallback((exercise) => {
    setEditingExerciseId(exercise.id);
    setExerciseDraft({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      exerciseType: exercise.exerciseType,
      description: exercise.description,
      instructions: exercise.instructions,
      commonMistakes: exercise.commonMistakes,
      thumbnailPath: exercise.thumbnailPath,
      thumbnailAlt: exercise.thumbnailAlt || exercise.name,
      videoUrl: exercise.videoUrl,
      active: exercise.active,
    });

    requestAnimationFrame(() => {
      exerciseFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  const openConfirmDialog = useCallback(({ title, description, actionType, targetId }) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      actionType,
      targetId,
    });
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({
      open: false,
      title: '',
      description: '',
      actionType: null,
      targetId: null,
    });
  }, []);

  const confirmDelete = useCallback(async () => {
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
  }, [confirmDialog, closeConfirmDialog, handleDeleteExercise, handleDeleteTemplate]);

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

      <TabsSelector tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'templates' ? (
        <TemplatesTabContent
          templateSearch={templateSearch}
          setTemplateSearch={setTemplateSearch}
          setEditingTemplateId={setEditingTemplateId}
          setIsBuildingTemplate={setIsBuildingTemplate}
          EMPTY_TEMPLATE={EMPTY_TEMPLATE}
          isBuildingTemplate={isBuildingTemplate}
          templateDraft={templateDraft}
          setTemplateDraft={setTemplateDraft}
          exerciseLibrary={exerciseLibrary}
          isSavingTemplate={isSavingTemplate}
          handleTemplateSubmit={handleTemplateSubmit}
          filteredTemplates={filteredTemplates}
          handleClone={handleClone}
          handleEditTemplate={handleEditTemplate}
          openConfirmDialog={openConfirmDialog}
          setAssignmentDraft={setAssignmentDraft}
          assignmentDraft={assignmentDraft}
          routineTemplates={routineTemplates}
          assignableMembers={assignableMembers}
          handleAssignTemplate={handleAssignTemplate}
        />
      ) : null}

      {activeTab === 'assigned' ? (
        <AssignedTabContent
          assignedSearch={assignedSearch}
          setAssignedSearch={setAssignedSearch}
          filteredAssigned={filteredAssigned}
        />
      ) : null}

      {activeTab === 'library' ? (
        <ExerciseLibraryTabContent
          totals={librarySummaryTotals}
          exerciseSearch={exerciseSearch}
          setExerciseSearch={setExerciseSearch}
          exerciseFilter={exerciseFilter}
          setExerciseFilter={setExerciseFilter}
          muscleGroups={muscleGroups}
          pagedExercises={pagedExercises}
          isLoadingExercises={isLoadingExercises}
          exercisePage={exercisePage}
          setExercisePage={setExercisePage}
          onEditExercise={handleEditExercise}
          openConfirmDialog={openConfirmDialog}
          exerciseFormRef={exerciseFormRef}
          editingExerciseId={editingExerciseId}
          exerciseDraft={exerciseDraft}
          setExerciseDraft={setExerciseDraft}
          handleExerciseSubmit={handleExerciseSubmit}
          isSavingExercise={isSavingExercise}
          onCancelEditing={() => {
            setExerciseDraft(EMPTY_EXERCISE);
            setEditingExerciseId(null);
          }}
        />
      ) : null}

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onCancel={closeConfirmDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default RoutinesManagement;

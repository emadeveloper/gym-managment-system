import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import mockNutritionData, { nutritionVariations } from '../components/layout/nutrition/mockNutritionData';
import {
  authAPI,
  exercisesAPI,
  nutritionPlansAPI,
  routineTemplatesAPI,
  routinesAPI,
  userAPI,
} from '../services/api';

const MEMBER_META_STORAGE_KEY = 'lr_member_meta';
const CLASSES_STORAGE_KEY = 'lr_classes';

const DEFAULT_MEMBERS = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    plan: 'Gold',
    status: 'Activo',
    lastCheckIn: 'Hoy · 08:15',
  },
  {
    id: 2,
    name: 'María López',
    email: 'maria@example.com',
    plan: 'Silver',
    status: 'Activo',
    lastCheckIn: 'Ayer · 19:40',
  },
  {
    id: 3,
    name: 'Carlos Díaz',
    email: 'carlos@example.com',
    plan: 'Bronze',
    status: 'Inactivo',
    lastCheckIn: 'Hace 14 días',
  },
  {
    id: 4,
    name: 'Ana Gómez',
    email: 'ana@example.com',
    plan: 'Platinum',
    status: 'Activo',
    lastCheckIn: 'Hoy · 06:30',
  },
  {
    id: 5,
    name: 'Valentina Ríos',
    email: 'valentina.rios@example.com',
    role: 'USER',
    plan: 'Elite Performance',
    status: 'Activo',
    lastCheckIn: 'Hoy · 07:05',
    phone: '+54 9 387 512-8891',
    dni: '39124567',
    birthDate: '1995-08-21',
    emergencyName: 'Santiago Ríos',
    emergencyPhone: '+54 9 387 510-2234',
    startDate: '2025-07-10',
    paymentMethod: 'Débito automático',
    notes: 'Objetivo principal: recomposición corporal y mejora de rendimiento.',
  },
];

const DEFAULT_ROUTINES = [
  {
    id: 1,
    name: 'Fuerza Full Body',
    level: 'Intermedio',
    duration: '60 min',
    sessionsPerWeek: 3,
    status: 'Activa',
    goal: 'Fuerza',
    coach: 'Julián Martínez',
    assignedMemberEmail: 'juan@example.com',
    assignedMemberName: 'Juan Pérez',
    exercises: 8,
    weeks: 6,
    focusArea: 'Full body',
  },
  {
    id: 2,
    name: 'Hipertrofia Tren Superior',
    level: 'Avanzado',
    duration: '75 min',
    sessionsPerWeek: 4,
    status: 'Activa',
    goal: 'Hipertrofia',
    coach: 'Lucía Fernández',
    assignedMemberEmail: 'maria@example.com',
    assignedMemberName: 'María López',
    exercises: 10,
    weeks: 8,
    focusArea: 'Tren superior',
  },
  {
    id: 3,
    name: 'Inicio en el Gym',
    level: 'Principiante',
    duration: '45 min',
    sessionsPerWeek: 2,
    status: 'Borrador',
    goal: 'Iniciación',
    coach: 'Julián Martínez',
    assignedMemberEmail: '',
    assignedMemberName: '',
    exercises: 6,
    weeks: 4,
    focusArea: 'Adaptación general',
  },
  {
    id: 4,
    name: 'Cardio & Core',
    level: 'Intermedio',
    duration: '40 min',
    sessionsPerWeek: 3,
    status: 'Archivada',
    goal: 'Resistencia',
    coach: 'Lucía Fernández',
    assignedMemberEmail: '',
    assignedMemberName: '',
    exercises: 7,
    weeks: 5,
    focusArea: 'Core y cardio',
  },
  {
    id: 5,
    name: 'Power Build 4D',
    level: 'Avanzado',
    duration: '70 min',
    sessionsPerWeek: 5,
    status: 'Activa',
    goal: 'Rendimiento',
    coach: 'Sofía Herrera',
    assignedMemberEmail: 'valentina.rios@example.com',
    assignedMemberName: 'Valentina Ríos',
    exercises: 12,
    weeks: 12,
    focusArea: 'Piernas + Empuje',
    todayWorkout: 'Piernas',
  },
];

const DEFAULT_NUTRITION_PLANS = [
  {
    id: 1,
    name: 'Déficit controlado',
    goal: 'Pérdida de grasa',
    calories: 2200,
    type: 'Personalizado',
    status: 'Activo',
    assignedMemberEmail: 'juan@example.com',
    assignedMemberName: 'Juan Pérez',
    reviewDate: '12 de Mayo, 2026',
    nutritionData: {
      ...mockNutritionData,
      user: {
        name: 'Juan Pérez',
        goal: 'Pérdida de grasa',
        activityLevel: 'Moderado',
      },
      dailyMacros: { ...mockNutritionData.dailyMacros },
      createdDate: '12 de Febrero, 2026',
      nextReview: '12 de Mayo, 2026',
    },
  },
  {
    id: 2,
    name: 'Ganancia limpia',
    goal: 'Hipertrofia',
    calories: 2800,
    type: 'Personalizado',
    status: 'Activo',
    assignedMemberEmail: 'maria@example.com',
    assignedMemberName: 'María López',
    reviewDate: '03 de Junio, 2026',
    nutritionData: {
      ...mockNutritionData,
      user: {
        name: 'María López',
        goal: 'Hipertrofia',
        activityLevel: 'Alto',
      },
      dailyMacros: { ...nutritionVariations.muscleGain.dailyMacros },
      createdDate: '03 de Marzo, 2026',
      nextReview: '03 de Junio, 2026',
    },
  },
  {
    id: 3,
    name: 'Inicio saludable',
    goal: 'Bienestar general',
    calories: 2100,
    type: 'Plantilla',
    status: 'Borrador',
    assignedMemberEmail: '',
    assignedMemberName: '',
    reviewDate: 'Sin revisión',
    nutritionData: {
      ...mockNutritionData,
      user: {
        name: 'Sin asignar',
        goal: 'Bienestar general',
        activityLevel: 'Moderado',
      },
      dailyMacros: { ...nutritionVariations.maintenance.dailyMacros },
      createdDate: 'Borrador',
      nextReview: 'Pendiente',
    },
  },
  {
    id: 4,
    name: 'Performance Lean Pro',
    goal: 'Rendimiento',
    calories: 2450,
    type: 'Personalizado',
    status: 'Activo',
    assignedMemberEmail: 'valentina.rios@example.com',
    assignedMemberName: 'Valentina Ríos',
    reviewDate: '21 de Junio, 2026',
    nutritionData: {
      ...mockNutritionData,
      user: {
        name: 'Valentina Ríos',
        goal: 'Rendimiento',
        activityLevel: 'Alto',
      },
      dailyMacros: { ...nutritionVariations.elite.dailyMacros, calories: 2450 },
      restrictions: ['Sin lactosa'],
      supplements: ['Creatina 5g', 'Omega 3'],
      tips: [
        'Priorizá proteínas en cada comida.',
        'Hidratación mínima de 2.5L diarios.',
        'Ajustá carbohidratos según intensidad de entreno.',
      ],
      createdDate: '21 de Marzo, 2026',
      nextReview: '21 de Junio, 2026',
    },
  },
];

const DEFAULT_MEMBER_META = DEFAULT_MEMBERS.reduce((accumulator, member) => {
  accumulator[member.email.toLowerCase()] = {
    id: member.id,
    name: member.name,
    plan: member.plan,
    status: member.status,
    lastCheckIn: member.lastCheckIn,
    phone: member.phone || '',
    dni: member.dni || '',
    birthDate: member.birthDate || '',
    emergencyName: member.emergencyName || '',
    emergencyPhone: member.emergencyPhone || '',
    startDate: member.startDate || '',
    paymentMethod: member.paymentMethod || '',
    notes: member.notes || '',
    role: member.role || 'USER',
  };

  return accumulator;
}, {});

const DEFAULT_CLASSES = [
  {
    id: 'class-hiit-2026-03-18',
    date: '2026-03-18',
    startTime: '18:00',
    endTime: '18:50',
    name: 'HIIT Training',
    title: 'HIIT Metabólico',
    classType: 'Cardio + resistencia',
    coach: 'Carlos López',
    description:
      'Bloque intenso por estaciones para mejorar capacidad aeróbica, resistencia y quema calórica.',
    capacity: 16,
    enrollments: [],
  },
  {
    id: 'class-strength-2026-03-20',
    date: '2026-03-20',
    startTime: '19:00',
    endTime: '20:00',
    name: 'Strength Training',
    title: 'Fuerza Base',
    classType: 'Fuerza',
    coach: 'María García',
    description:
      'Trabajo técnico de básicos con progresión de cargas para ganar fuerza útil y controlar la ejecución.',
    capacity: 14,
    enrollments: [],
  },
];

const GymDataContext = createContext(null);

function readStorage(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function formatNameFromEmail(email = '') {
  const base = email.split('@')[0] || 'Cliente nuevo';

  return base
    .split(/[._-]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function formatDisplayDate(dateValue) {
  if (!dateValue) {
    return 'Pendiente';
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Pendiente';
  }

  return dateValue
    ? parsedDate.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Pendiente';
}

function splitTextValue(value, separator = ',') {
  if (!value) {
    return [];
  }

  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveAssignedMemberName(email, fallbackName, memberMeta) {
  const normalizedEmail = email?.toLowerCase();
  return memberMeta[normalizedEmail]?.name || fallbackName || formatNameFromEmail(email);
}

function mapRoutineRecord(apiRoutine, memberMeta = {}) {
  return {
    id: apiRoutine.id,
    name: apiRoutine.name,
    goal: apiRoutine.goal,
    level: apiRoutine.level,
    duration: apiRoutine.duration,
    sessionsPerWeek: Number(apiRoutine.sessionsPerWeek),
    weeks: Number(apiRoutine.weeks) || 0,
    restWindow: apiRoutine.restWindow || '',
    status: apiRoutine.status,
    coach: apiRoutine.coach,
    focusArea: apiRoutine.focusArea,
    equipment: apiRoutine.equipment,
    todayWorkout: apiRoutine.todayWorkout || '',
    notesTag: apiRoutine.notesTag || '',
    notes: apiRoutine.notes || '',
    sourceTemplateId: apiRoutine.sourceTemplateId || null,
    assignedMemberEmail: apiRoutine.assignedMemberEmail || '',
    assignedMemberName: resolveAssignedMemberName(
      apiRoutine.assignedMemberEmail,
      apiRoutine.assignedMemberName,
      memberMeta,
    ),
    exercises: Number(apiRoutine.exercises) || 0,
  };
}

function mapNutritionPlanRecord(apiPlan, memberMeta = {}) {
  const goalMap = {
    'Pérdida de grasa': nutritionVariations.fatloss.dailyMacros,
    Hipertrofia: nutritionVariations.muscleGain.dailyMacros,
    Mantenimiento: nutritionVariations.maintenance.dailyMacros,
    Rendimiento: nutritionVariations.elite.dailyMacros,
    'Bienestar general': nutritionVariations.maintenance.dailyMacros,
  };
  const fallbackMacros = goalMap[apiPlan.goal] || nutritionVariations.maintenance.dailyMacros;
  const macros = {
    calories: Number(apiPlan.calories) || fallbackMacros.calories,
    protein: Number(apiPlan.protein) || fallbackMacros.protein,
    carbs: Number(apiPlan.carbs) || fallbackMacros.carbs,
    fat: Number(apiPlan.fat) || fallbackMacros.fat,
  };
  const reviewDate = formatDisplayDate(apiPlan.reviewDate);

  const assignedMemberName = resolveAssignedMemberName(
    apiPlan.assignedMemberEmail,
    apiPlan.assignedMemberName,
    memberMeta,
  );

  return {
    id: apiPlan.id,
    name: apiPlan.name,
    goal: apiPlan.goal,
    calories: macros.calories,
    type: apiPlan.type,
    status: apiPlan.status,
    assignedMemberEmail: apiPlan.assignedMemberEmail || '',
    assignedMemberName,
    reviewDate,
    nutritionData: {
      ...mockNutritionData,
      user: {
        name: assignedMemberName,
        goal: apiPlan.goal,
        activityLevel: apiPlan.activityLevel || 'Moderado',
      },
      dailyMacros: macros,
      restrictions: splitTextValue(apiPlan.restrictions),
      supplements: splitTextValue(apiPlan.supplements),
      tips: splitTextValue(apiPlan.tips, '\n'),
      createdDate: formatDisplayDate(apiPlan.createdDate),
      nextReview: reviewDate,
    },
  };
}

function mapRoutineTemplateRecord(apiTemplate) {
  return {
    id: apiTemplate.id,
    name: apiTemplate.name,
    objective: apiTemplate.objective,
    level: apiTemplate.level,
    daysPerWeek: Number(apiTemplate.daysPerWeek) || 0,
    estimatedDurationWeeks: Number(apiTemplate.estimatedDurationWeeks) || 0,
    description: apiTemplate.description || '',
    active: apiTemplate.active !== false,
    days: Array.isArray(apiTemplate.days) ? apiTemplate.days : [],
  };
}

function mapExerciseRecord(apiExercise) {
  return {
    id: apiExercise.id,
    name: apiExercise.name,
    slug: apiExercise.slug,
    muscleGroup: apiExercise.muscleGroup,
    equipment: apiExercise.equipment,
    exerciseType: apiExercise.exerciseType,
    description: apiExercise.description,
    instructions: apiExercise.instructions,
    commonMistakes: apiExercise.commonMistakes || '',
    thumbnailPath: apiExercise.thumbnailPath || '',
    thumbnailAlt: apiExercise.thumbnailAlt || apiExercise.name || '',
    videoUrl: apiExercise.videoUrl || '',
    active: apiExercise.active !== false,
  };
}

function resolveFallbackRoutines(currentUser, memberMeta = {}) {
  const mappedRoutines = DEFAULT_ROUTINES.map((routine) => mapRoutineRecord(routine, memberMeta));

  if (currentUser?.role === 'ADMIN') {
    return mappedRoutines;
  }

  return mappedRoutines.filter(
    (routine) =>
      routine.assignedMemberEmail &&
      routine.assignedMemberEmail.toLowerCase() === currentUser?.email?.toLowerCase(),
  );
}

function resolveFallbackNutritionPlans(currentUser, memberMeta = {}) {
  const mappedPlans = DEFAULT_NUTRITION_PLANS.map((plan) => mapNutritionPlanRecord(plan, memberMeta));

  if (currentUser?.role === 'ADMIN') {
    return mappedPlans;
  }

  return mappedPlans.filter(
    (plan) =>
      plan.assignedMemberEmail &&
      plan.assignedMemberEmail.toLowerCase() === currentUser?.email?.toLowerCase(),
  );
}

function mergeMemberRecord(apiUser, meta = {}) {
  const email = apiUser?.email || meta.email || '';

  return {
    id: apiUser?.id || meta.id || email || Date.now(),
    name: meta.name || apiUser?.name || formatNameFromEmail(email),
    email,
    role: apiUser?.role || meta.role || 'USER',
    plan: meta.plan || 'Pendiente',
    status: meta.status || 'Activo',
    lastCheckIn: meta.lastCheckIn || 'Pendiente',
    phone: meta.phone || '',
    dni: meta.dni || '',
    birthDate: meta.birthDate || '',
    emergencyName: meta.emergencyName || '',
    emergencyPhone: meta.emergencyPhone || '',
    startDate: meta.startDate || '',
    paymentMethod: meta.paymentMethod || '',
    notes: meta.notes || '',
  };
}

function buildMembersFromMetadata(memberMeta) {
  return Object.entries(memberMeta).map(([email, meta]) =>
    mergeMemberRecord(
      {
        id: meta.id || email,
        email,
        name: meta.name,
        role: meta.role || 'USER',
      },
      meta,
    ),
  );
}

export function GymDataProvider({ children }) {
  const { user } = useAuth();
  const [memberMeta, setMemberMeta] = useState(() => ({
    ...DEFAULT_MEMBER_META,
    ...readStorage(MEMBER_META_STORAGE_KEY, {}),
  }));
  const [members, setMembers] = useState(() => buildMembersFromMetadata(DEFAULT_MEMBER_META));
  const [routines, setRoutines] = useState([]);
  const [routineTemplates, setRoutineTemplates] = useState([]);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [classes, setClasses] = useState(() => readStorage(CLASSES_STORAGE_KEY, DEFAULT_CLASSES));

  useEffect(() => {
    writeStorage(MEMBER_META_STORAGE_KEY, memberMeta);
  }, [memberMeta]);

  useEffect(() => {
    writeStorage(CLASSES_STORAGE_KEY, classes);
  }, [classes]);

  useEffect(() => {
    let isActive = true;

    async function syncMembers() {
      if (!user?.email) {
        if (isActive) {
          setMembers(buildMembersFromMetadata(memberMeta));
        }
        return;
      }

      if (user.role !== 'ADMIN') {
        if (isActive) {
          setMembers([
            mergeMemberRecord(user, memberMeta[user.email.toLowerCase()]),
          ]);
        }
        return;
      }

      try {
        const response = await userAPI.getAll();
        if (!isActive) {
          return;
        }

        setMembers(
          response.data.map((apiUser) =>
            mergeMemberRecord(apiUser, memberMeta[apiUser.email.toLowerCase()]),
          ),
        );
      } catch {
        if (isActive) {
          setMembers(buildMembersFromMetadata(memberMeta));
        }
      }
    }

    syncMembers();

    return () => {
      isActive = false;
    };
  }, [user, memberMeta]);

  useEffect(() => {
    let isActive = true;

    async function syncRoutineAssets() {
      if (!user?.email || user.role !== 'ADMIN') {
        if (isActive) {
          setRoutineTemplates([]);
          setExerciseLibrary([]);
        }
        return;
      }

      try {
        const [templateResponse, exerciseResponse] = await Promise.all([
          routineTemplatesAPI.getAll(),
          exercisesAPI.getAll(),
        ]);

        if (!isActive) {
          return;
        }

        setRoutineTemplates(templateResponse.data.map(mapRoutineTemplateRecord));
        setExerciseLibrary(exerciseResponse.data.map(mapExerciseRecord));
      } catch {
        if (isActive) {
          setRoutineTemplates([]);
          setExerciseLibrary([]);
        }
      }
    }

    syncRoutineAssets();

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    let isActive = true;

    async function syncAssignments() {
      if (!user?.email) {
        if (isActive) {
          setRoutines([]);
          setNutritionPlans([]);
        }
        return;
      }

      const routineRequest = user.role === 'ADMIN' ? routinesAPI.getAll() : routinesAPI.getMine();
      const nutritionRequest =
        user.role === 'ADMIN' ? nutritionPlansAPI.getAll() : nutritionPlansAPI.getMine();

      try {
        const [routineResponse, nutritionResponse] = await Promise.all([
          routineRequest,
          nutritionRequest,
        ]);

        if (!isActive) {
          return;
        }

        setRoutines(routineResponse.data.map((routine) => mapRoutineRecord(routine, memberMeta)));
        setNutritionPlans(
          nutritionResponse.data.map((plan) => mapNutritionPlanRecord(plan, memberMeta)),
        );
      } catch {
        if (isActive) {
          setRoutines(resolveFallbackRoutines(user, memberMeta));
          setNutritionPlans(resolveFallbackNutritionPlans(user, memberMeta));
        }
      }
    }

    syncAssignments();

    return () => {
      isActive = false;
    };
  }, [user, memberMeta]);

  const addMember = async (memberData) => {
    const fullName = `${memberData.firstName} ${memberData.lastName}`.trim();
    const normalizedEmail = memberData.email.toLowerCase();
    const response = await authAPI.register(memberData.email, memberData.password);
    const createdUser = response.data.user;
    const profileResponse = await userAPI.update(createdUser.id, {
      name: memberData.firstName.trim(),
      lastName: memberData.lastName.trim(),
      dni: memberData.dni || null,
      phone: memberData.phone || null,
    });
    const hydratedUser = profileResponse.data;
    const nextMeta = {
      id: hydratedUser.id,
      name: hydratedUser.name || fullName || formatNameFromEmail(memberData.email),
      plan: memberData.plan || 'Pendiente',
      status: memberData.status || 'Pendiente',
      lastCheckIn: 'Recién creado',
      phone: memberData.phone || '',
      dni: memberData.dni || '',
      birthDate: memberData.birthDate || '',
      emergencyName: memberData.emergencyName || '',
      emergencyPhone: memberData.emergencyPhone || '',
      startDate: memberData.startDate || '',
      paymentMethod: memberData.paymentMethod || '',
      notes: memberData.notes || '',
      role: hydratedUser.role,
    };

    setMemberMeta((currentMeta) => ({
      ...currentMeta,
      [normalizedEmail]: nextMeta,
    }));

    const createdMember = mergeMemberRecord(hydratedUser, nextMeta);
    setMembers((currentMembers) => {
      const existingMemberIndex = currentMembers.findIndex(
        (member) => member.email.toLowerCase() === normalizedEmail,
      );

      if (existingMemberIndex === -1) {
        return [createdMember, ...currentMembers];
      }

      return currentMembers.map((member, index) =>
        index === existingMemberIndex ? createdMember : member,
      );
    });

    return createdMember;
  };

  const addRoutine = async (routineData) => {
    const payload = {
      name: routineData.name,
      assignedMemberEmail: routineData.assignedMemberEmail.toLowerCase(),
      goal: routineData.goal,
      level: routineData.level,
      duration: routineData.duration,
      sessionsPerWeek: Number(routineData.sessionsPerWeek),
      weeks: Number(routineData.weeks) || 1,
      restWindow: routineData.restWindow || '',
      status: routineData.status,
      coach: routineData.coach,
      exercises:
        Number(routineData.exercises) || Math.max(4, Number(routineData.sessionsPerWeek || 0) * 2),
      focusArea: routineData.focusArea,
      equipment: routineData.equipment,
      notesTag: routineData.notesTag || '',
      notes: routineData.notes || '',
    };
    const response = routineData.id
      ? await routinesAPI.update(routineData.id, payload)
      : await routinesAPI.create(payload);
    const finalRoutine = mapRoutineRecord(response.data, memberMeta);

    setRoutines((currentRoutines) => {
      const exists = currentRoutines.some((routine) => routine.id === finalRoutine.id);
      if (exists) {
        return currentRoutines.map((routine) =>
          routine.id === finalRoutine.id ? finalRoutine : routine,
        );
      }
      return [finalRoutine, ...currentRoutines];
    });

    return finalRoutine;
  };

  const createRoutineTemplate = async (templateData) => {
    const response = await routineTemplatesAPI.create(templateData);
    const mappedTemplate = mapRoutineTemplateRecord(response.data);
    setRoutineTemplates((current) => [mappedTemplate, ...current]);
    return mappedTemplate;
  };

  const cloneRoutineTemplate = async (templateId, name) => {
    const response = await routineTemplatesAPI.clone(templateId, name);
    const mappedTemplate = mapRoutineTemplateRecord(response.data);
    setRoutineTemplates((current) => [mappedTemplate, ...current]);
    return mappedTemplate;
  };

  const updateRoutineTemplate = async (templateId, templateData) => {
    const response = await routineTemplatesAPI.update(templateId, templateData);
    const mappedTemplate = mapRoutineTemplateRecord(response.data);
    setRoutineTemplates((current) =>
      current.map((template) => (template.id === templateId ? mappedTemplate : template)),
    );
    return mappedTemplate;
  };

  const deleteRoutineTemplate = async (templateId) => {
    await routineTemplatesAPI.remove(templateId);
    setRoutineTemplates((current) => current.filter((template) => template.id !== templateId));
  };

  const assignRoutineTemplate = async (templateId, assignmentData) => {
    const response = await routineTemplatesAPI.assign(templateId, assignmentData);
    const mappedRoutine = mapRoutineRecord(response.data, memberMeta);
    setRoutines((current) => [mappedRoutine, ...current]);
    return mappedRoutine;
  };

  const createExercise = async (exerciseData) => {
    const response = await exercisesAPI.create(exerciseData);
    const mappedExercise = mapExerciseRecord(response.data);
    setExerciseLibrary((current) => [mappedExercise, ...current]);
    return mappedExercise;
  };

  const updateExercise = async (exerciseId, exerciseData) => {
    const response = await exercisesAPI.update(exerciseId, exerciseData);
    const mappedExercise = mapExerciseRecord(response.data);
    setExerciseLibrary((current) =>
      current.map((exercise) => (exercise.id === exerciseId ? mappedExercise : exercise)),
    );
    return mappedExercise;
  };

  const deleteExercise = async (exerciseId) => {
    await exercisesAPI.remove(exerciseId);
    setExerciseLibrary((current) => current.filter((exercise) => exercise.id !== exerciseId));
  };

  const getAssignedRoutinesForUser = (email) =>
    routines.filter(
      (routine) =>
        routine.assignedMemberEmail &&
        routine.assignedMemberEmail.toLowerCase() === email?.toLowerCase(),
    );

  const addNutritionPlan = async (planData) => {
    const goalMap = {
      'Pérdida de grasa': nutritionVariations.fatloss.dailyMacros,
      Hipertrofia: nutritionVariations.muscleGain.dailyMacros,
      Mantenimiento: nutritionVariations.maintenance.dailyMacros,
      Rendimiento: nutritionVariations.elite.dailyMacros,
      'Bienestar general': nutritionVariations.maintenance.dailyMacros,
    };
    const fallbackMacros = goalMap[planData.goal] || nutritionVariations.maintenance.dailyMacros;
    const payload = {
      name: planData.name,
      assignedMemberEmail: planData.assignedMemberEmail.toLowerCase(),
      goal: planData.goal,
      type: planData.type,
      calories: Number(planData.calories) || fallbackMacros.calories,
      protein: Number(planData.protein) || fallbackMacros.protein,
      carbs: Number(planData.carbs) || fallbackMacros.carbs,
      fat: Number(planData.fat) || fallbackMacros.fat,
      reviewDate: planData.reviewDate || '',
      status: planData.status,
      activityLevel: planData.activityLevel || 'Moderado',
      restrictions: planData.restrictions || '',
      supplements: planData.supplements || '',
      tips: planData.tips || '',
    };
    const response = planData.id
      ? await nutritionPlansAPI.update(planData.id, payload)
      : await nutritionPlansAPI.create(payload);
    const finalPlan = mapNutritionPlanRecord(response.data, memberMeta);

    setNutritionPlans((currentPlans) => {
      const exists = currentPlans.some((plan) => plan.id === finalPlan.id);
      if (exists) {
        return currentPlans.map((plan) => (plan.id === finalPlan.id ? finalPlan : plan));
      }
      return [finalPlan, ...currentPlans];
    });

    return finalPlan;
  };

  const getAssignedNutritionForUser = (email) =>
    nutritionPlans.find(
      (plan) =>
        plan.assignedMemberEmail &&
        plan.assignedMemberEmail.toLowerCase() === email?.toLowerCase() &&
        plan.status === 'Activo',
    ) || null;

  const addClass = async (classData) => {
    const newClass = {
      id: `class-${Date.now()}`,
      date: classData.date,
      startTime: classData.startTime,
      endTime: classData.endTime || '',
      name: classData.name.trim(),
      title: classData.title.trim(),
      classType: classData.classType.trim(),
      coach: classData.coach?.trim() || 'Staff La Resistencia',
      description: classData.description.trim(),
      capacity: Math.max(1, Number(classData.capacity) || 1),
      enrollments: [],
    };

    setClasses((currentClasses) =>
      [...currentClasses, newClass].sort(
        (first, second) =>
          `${first.date}T${first.startTime}`.localeCompare(`${second.date}T${second.startTime}`),
      ),
    );

    return newClass;
  };

  const enrollInClass = async ({ classId, user: currentUser, fullName, phone, notes }) => {
    if (!currentUser?.email) {
      throw new Error('Necesitás iniciar sesión para inscribirte.');
    }

    const normalizedEmail = currentUser.email.toLowerCase();
    let enrolledClass = null;
    let enrollmentRecord = null;
    let enrollmentError = null;

    setClasses((currentClasses) =>
      currentClasses.map((classItem) => {
        if (classItem.id !== classId) {
          return classItem;
        }

        const alreadyEnrolled = classItem.enrollments.some(
          (enrollment) => enrollment.memberEmail.toLowerCase() === normalizedEmail,
        );

        if (alreadyEnrolled) {
          enrollmentError = new Error('Ya estás inscripto en esta clase.');
          return classItem;
        }

        if (classItem.enrollments.length >= classItem.capacity) {
          enrollmentError = new Error('No quedan cupos disponibles para esta clase.');
          return classItem;
        }

        enrollmentRecord = {
          id: `enrollment-${Date.now()}`,
          memberEmail: normalizedEmail,
          memberName:
            fullName?.trim() || currentUser.name?.trim() || formatNameFromEmail(currentUser.email),
          phone: phone?.trim() || '',
          notes: notes?.trim() || '',
          createdAt: new Date().toISOString(),
        };

        enrolledClass = {
          ...classItem,
          enrollments: [...classItem.enrollments, enrollmentRecord],
        };

        return enrolledClass;
      }),
    );

    if (enrollmentError) {
      throw enrollmentError;
    }

    if (!enrolledClass) {
      throw new Error('No encontramos la clase seleccionada.');
    }

    return {
      classData: enrolledClass,
      enrollment: enrollmentRecord,
    };
  };

  const value = {
    members,
    routines,
    routineTemplates,
    exerciseLibrary,
    nutritionPlans,
    classes,
    addMember,
    addRoutine,
    createRoutineTemplate,
    cloneRoutineTemplate,
    updateRoutineTemplate,
    deleteRoutineTemplate,
    assignRoutineTemplate,
    createExercise,
    updateExercise,
    deleteExercise,
    addNutritionPlan,
    addClass,
    enrollInClass,
    getAssignedRoutinesForUser,
    getAssignedNutritionForUser,
  };

  return <GymDataContext.Provider value={value}>{children}</GymDataContext.Provider>;
}

export function useGymData() {
  const context = useContext(GymDataContext);

  if (!context) {
    throw new Error('useGymData must be used within a GymDataProvider');
  }

  return context;
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import mockNutritionData, { nutritionVariations } from '../components/layout/nutrition/mockNutritionData';
import { authAPI, userAPI } from '../services/api';

const MEMBER_META_STORAGE_KEY = 'lr_member_meta';
const ROUTINES_STORAGE_KEY = 'lr_routines';
const NUTRITION_STORAGE_KEY = 'lr_nutrition_plans';

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
];

const DEFAULT_MEMBER_META = DEFAULT_MEMBERS.reduce((accumulator, member) => {
  accumulator[member.email.toLowerCase()] = {
    name: member.name,
    plan: member.plan,
    status: member.status,
    lastCheckIn: member.lastCheckIn,
  };

  return accumulator;
}, {});

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
  return dateValue
    ? new Date(dateValue).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Pendiente';
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
  const [memberMeta, setMemberMeta] = useState(() =>
    readStorage(MEMBER_META_STORAGE_KEY, DEFAULT_MEMBER_META),
  );
  const [members, setMembers] = useState(() => buildMembersFromMetadata(DEFAULT_MEMBER_META));
  const [routines, setRoutines] = useState(() => readStorage(ROUTINES_STORAGE_KEY, DEFAULT_ROUTINES));
  const [nutritionPlans, setNutritionPlans] = useState(() =>
    readStorage(NUTRITION_STORAGE_KEY, DEFAULT_NUTRITION_PLANS),
  );

  useEffect(() => {
    writeStorage(MEMBER_META_STORAGE_KEY, memberMeta);
  }, [memberMeta]);

  useEffect(() => {
    writeStorage(ROUTINES_STORAGE_KEY, routines);
  }, [routines]);

  useEffect(() => {
    writeStorage(NUTRITION_STORAGE_KEY, nutritionPlans);
  }, [nutritionPlans]);

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

  const addMember = async (memberData) => {
    const fullName = `${memberData.firstName} ${memberData.lastName}`.trim();
    const normalizedEmail = memberData.email.toLowerCase();
    const response = await authAPI.register(memberData.email, memberData.password);
    const createdUser = response.data.user;
    const nextMeta = {
      id: createdUser.id,
      name: fullName || formatNameFromEmail(memberData.email),
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
      role: createdUser.role,
    };

    setMemberMeta((currentMeta) => ({
      ...currentMeta,
      [normalizedEmail]: nextMeta,
    }));

    const createdMember = mergeMemberRecord(createdUser, nextMeta);
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

  const addRoutine = (routineData) => {
    const assignedMember = members.find(
      (member) => member.email.toLowerCase() === routineData.assignedMemberEmail.toLowerCase(),
    );

    const nextRoutine = {
      name: routineData.name,
      goal: routineData.goal,
      level: routineData.level,
      duration: routineData.duration,
      sessionsPerWeek: Number(routineData.sessionsPerWeek),
      weeks: Number(routineData.weeks) || 0,
      restWindow: routineData.restWindow,
      status: routineData.status,
      coach: routineData.coach,
      focusArea: routineData.focusArea,
      equipment: routineData.equipment,
      notesTag: routineData.notesTag,
      notes: routineData.notes,
      assignedMemberEmail: routineData.assignedMemberEmail,
      assignedMemberName: assignedMember?.name || formatNameFromEmail(routineData.assignedMemberEmail),
      exercises: Number(routineData.exercises) || Math.max(4, Number(routineData.sessionsPerWeek) * 2),
    };

    const routineId = routineData.id || Date.now();
    const finalRoutine = { id: routineId, ...nextRoutine };

    if (routineData.id) {
      setRoutines((currentRoutines) =>
        currentRoutines.map((routine) => (routine.id === routineData.id ? finalRoutine : routine)),
      );
      return finalRoutine;
    }

    setRoutines((currentRoutines) => [finalRoutine, ...currentRoutines]);
    return finalRoutine;
  };

  const getAssignedRoutinesForUser = (email) =>
    routines.filter(
      (routine) =>
        routine.assignedMemberEmail &&
        routine.assignedMemberEmail.toLowerCase() === email?.toLowerCase(),
    );

  const addNutritionPlan = (planData) => {
    const assignedMember = members.find(
      (member) => member.email.toLowerCase() === planData.assignedMemberEmail.toLowerCase(),
    );

    const goalMap = {
      'Pérdida de grasa': nutritionVariations.fatloss.dailyMacros,
      Hipertrofia: nutritionVariations.muscleGain.dailyMacros,
      Mantenimiento: nutritionVariations.maintenance.dailyMacros,
      Rendimiento: nutritionVariations.elite.dailyMacros,
      'Bienestar general': nutritionVariations.maintenance.dailyMacros,
    };
    const fallbackMacros = goalMap[planData.goal] || nutritionVariations.maintenance.dailyMacros;
    const macros = {
      calories: Number(planData.calories) || fallbackMacros.calories,
      protein: Number(planData.protein) || fallbackMacros.protein,
      carbs: Number(planData.carbs) || fallbackMacros.carbs,
      fat: Number(planData.fat) || fallbackMacros.fat,
    };
    const memberName =
      assignedMember?.name || formatNameFromEmail(planData.assignedMemberEmail);
    const today = new Date();
    const reviewDate = formatDisplayDate(planData.reviewDate);

    const nextPlan = {
      name: planData.name,
      goal: planData.goal,
      calories: macros.calories,
      type: planData.type,
      status: planData.status,
      assignedMemberEmail: planData.assignedMemberEmail,
      assignedMemberName: memberName,
      reviewDate,
      nutritionData: {
        ...mockNutritionData,
        user: {
          name: memberName,
          goal: planData.goal,
          activityLevel: planData.activityLevel || 'Moderado',
        },
        dailyMacros: macros,
        restrictions: planData.restrictions
          ? planData.restrictions
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : mockNutritionData.restrictions,
        supplements: planData.supplements
          ? planData.supplements
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : mockNutritionData.supplements,
        tips: planData.tips
          ? planData.tips
              .split('\n')
              .map((item) => item.trim())
              .filter(Boolean)
          : mockNutritionData.tips,
        createdDate: planData.createdDate || formatDisplayDate(today),
        nextReview: reviewDate,
      },
    };

    const planId = planData.id || Date.now();
    const finalPlan = { id: planId, ...nextPlan };

    if (planData.id) {
      setNutritionPlans((currentPlans) =>
        currentPlans.map((plan) => (plan.id === planData.id ? finalPlan : plan)),
      );
      return finalPlan;
    }

    setNutritionPlans((currentPlans) => [finalPlan, ...currentPlans]);
    return finalPlan;
  };

  const getAssignedNutritionForUser = (email) =>
    nutritionPlans.find(
      (plan) =>
        plan.assignedMemberEmail &&
        plan.assignedMemberEmail.toLowerCase() === email?.toLowerCase() &&
        plan.status === 'Activo',
    ) || null;

  const value = {
    members,
    routines,
    nutritionPlans,
    addMember,
    addRoutine,
    addNutritionPlan,
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

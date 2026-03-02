import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import mockNutritionData, { nutritionVariations } from '../components/layout/nutrition/mockNutritionData';

const MEMBERS_STORAGE_KEY = 'lr_members';
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

function buildMemberFromAuthUser(user) {
  return {
    id: Date.now(),
    name: user.name || formatNameFromEmail(user.email),
    email: user.email,
    plan: user.plan || 'Pendiente',
    status: 'Activo',
    lastCheckIn: 'Pendiente',
  };
}

export function GymDataProvider({ children }) {
  const { user } = useAuth();
  const [members, setMembers] = useState(() => readStorage(MEMBERS_STORAGE_KEY, DEFAULT_MEMBERS));
  const [routines, setRoutines] = useState(() => readStorage(ROUTINES_STORAGE_KEY, DEFAULT_ROUTINES));
  const [nutritionPlans, setNutritionPlans] = useState(() =>
    readStorage(NUTRITION_STORAGE_KEY, DEFAULT_NUTRITION_PLANS),
  );

  useEffect(() => {
    writeStorage(MEMBERS_STORAGE_KEY, members);
  }, [members]);

  useEffect(() => {
    writeStorage(ROUTINES_STORAGE_KEY, routines);
  }, [routines]);

  useEffect(() => {
    writeStorage(NUTRITION_STORAGE_KEY, nutritionPlans);
  }, [nutritionPlans]);

  useEffect(() => {
    if (!user?.email || user.role === 'ADMIN') {
      return;
    }

    setMembers((currentMembers) => {
      const existingMember = currentMembers.find(
        (member) => member.email.toLowerCase() === user.email.toLowerCase(),
      );

      if (existingMember) {
        return currentMembers;
      }

      return [...currentMembers, buildMemberFromAuthUser(user)];
    });
  }, [user]);

  const addMember = (memberData) => {
    const fullName = `${memberData.firstName} ${memberData.lastName}`.trim();

    const nextMember = {
      id: Date.now(),
      name: fullName || formatNameFromEmail(memberData.email),
      email: memberData.email,
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
    };

    setMembers((currentMembers) => [...currentMembers, nextMember]);
    return nextMember;
  };

  const addRoutine = (routineData) => {
    const assignedMember = members.find(
      (member) => member.email.toLowerCase() === routineData.assignedMemberEmail.toLowerCase(),
    );

    const nextRoutine = {
      id: Date.now(),
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

    setRoutines((currentRoutines) => [nextRoutine, ...currentRoutines]);
    return nextRoutine;
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
    const reviewDate = planData.reviewDate
      ? new Date(planData.reviewDate).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Pendiente';

    const nextPlan = {
      id: Date.now(),
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
        createdDate: today.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        nextReview: reviewDate,
      },
    };

    setNutritionPlans((currentPlans) => [nextPlan, ...currentPlans]);
    return nextPlan;
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

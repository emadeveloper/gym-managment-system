import React, { Suspense, lazy, useCallback, useDeferredValue, useMemo, useState } from 'react';
import { Clock3, Plus, ShieldCheck, Users } from 'lucide-react';
import { useGymData } from '../../../../context/GymDataContext';
import { UserStats } from './UserStats';
import { UsersTable } from './UsersTable';

const UsersCreateView = lazy(() => import('./UsersCreateView'));

const FILTERS = [
  { label: 'Todos', tone: 'default' },
  { label: 'Activos', tone: 'success' },
  { label: 'Inactivos', tone: 'danger' },
];

export const UsersManagement = () => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { members, routines, nutritionPlans } = useGymData();

  const usersWithAssignments = useMemo(
    () =>
      members.map((member) => {
        const memberRoutine =
          routines.find(
            (routine) =>
              routine.assignedMemberEmail &&
              routine.assignedMemberEmail.toLowerCase() === member.email.toLowerCase(),
          ) || null;
        const memberNutrition =
          nutritionPlans.find(
            (plan) =>
              plan.assignedMemberEmail &&
              plan.assignedMemberEmail.toLowerCase() === member.email.toLowerCase(),
          ) || null;

        return {
          ...member,
          currentRoutine: memberRoutine,
          currentNutritionPlan: memberNutrition,
        };
      }),
    [members, routines, nutritionPlans],
  );

  const filteredUsers = useMemo(
    () =>
      usersWithAssignments.filter((member) => {
        const matchesFilter =
          activeFilter === 'Todos' ||
          (activeFilter === 'Activos' && member.status === 'Activo') ||
          (activeFilter === 'Inactivos' && member.status !== 'Activo');

        if (!matchesFilter) {
          return false;
        }

        const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
        if (!normalizedSearch) {
          return true;
        }

        return (
          member.name.toLowerCase().includes(normalizedSearch) ||
          member.email.toLowerCase().includes(normalizedSearch) ||
          member.plan.toLowerCase().includes(normalizedSearch)
        );
      }),
    [usersWithAssignments, activeFilter, deferredSearchTerm],
  );

  const activeMembers = members.filter((member) => member.status === 'Activo').length;
  const pendingMembers = members.filter((member) => member.status === 'Pendiente').length;
  const recentMembers = members.filter((member) => member.lastCheckIn === 'Recién creado').length;

  const metrics = useMemo(
    () => [
      {
        label: 'Total de miembros',
        value: String(members.length),
        detail: 'Roster disponible para asignación y seguimiento',
        icon: Users,
        accent: 'text-white',
      },
      {
        label: 'Miembros activos',
        value: String(activeMembers),
        detail: 'Con estado operativo vigente',
        icon: ShieldCheck,
        accent: 'text-emerald-400',
      },
      {
        label: 'Nuevos este mes',
        value: String(recentMembers),
        detail: 'Altas creadas desde el panel',
        icon: Plus,
        accent: 'text-primary',
      },
      {
        label: 'Pendientes',
        value: String(pendingMembers),
        detail: 'Requieren activación o seguimiento',
        icon: Clock3,
        accent: 'text-white',
      },
    ],
    [members.length, activeMembers, recentMembers, pendingMembers],
  );

  const handleExportCsv = useCallback(() => {
    const csvHeaders = [
      'Nombre',
      'Email',
      'Plan',
      'Ultimo check-in',
      'Rutina actual',
      'Estado rutina',
      'Plan nutricional',
      'Estado plan',
      'Estado miembro',
    ];

    const csvRows = filteredUsers.map((user) => [
      user.name,
      user.email,
      user.plan,
      user.lastCheckIn,
      user.currentRoutine?.name || 'Sin rutina',
      user.currentRoutine?.status === 'Activa' ? 'Activa' : 'Inactiva',
      user.currentNutritionPlan?.name || 'Sin plan',
      user.currentNutritionPlan?.status === 'Activo' ? 'Activo' : 'Inactivo',
      user.status,
    ]);

    const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csvContent = [csvHeaders, ...csvRows].map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateLabel = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute('download', `roster-miembros-${dateLabel}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredUsers]);

  if (isCreatingUser) {
    return (
      <Suspense fallback={<div className="text-sm text-gray-400">Cargando formulario...</div>}>
        <UsersCreateView onBack={() => setIsCreatingUser(false)} />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">Administración</p>
          <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">Gestión de Usuarios</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
            Supervisá miembros, actividad reciente y estado de sus planes desde un solo frente. El objetivo es detectar rápido quién está entrenando, quién cayó en inactividad y dónde intervenir.
          </p>
        </div>
      </section>

      <UserStats
        membersCount={members.length}
        activeMembers={activeMembers}
        pendingMembers={pendingMembers}
        metrics={metrics}
      />

      <UsersTable
        users={filteredUsers}
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExportCsv={handleExportCsv}
        onCreateUser={() => setIsCreatingUser(true)}
        membersCount={members.length}
        activeMembers={activeMembers}
        pendingMembers={pendingMembers}
      />
    </div>
  );
};

export default UsersManagement;

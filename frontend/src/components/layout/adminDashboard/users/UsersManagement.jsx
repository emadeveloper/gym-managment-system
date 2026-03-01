import React, { useState } from 'react';
import { Card } from '../../../ui/Card';
import { Search, Download, Plus, ShieldCheck, Users, Clock3 } from 'lucide-react';
import UsersCreateView from './UsersCreateView';

const MOCK_USERS = [
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

const FILTERS = [
  { label: 'Todos', tone: 'default', active: true },
  { label: 'Activos', tone: 'success', active: false },
  { label: 'Inactivos', tone: 'danger', active: false },
];

const METRICS = [
  {
    label: 'Total de miembros',
    value: '1,400',
    detail: '+32 en los últimos 30 días',
    icon: Users,
    accent: 'text-white',
  },
  {
    label: 'Miembros activos',
    value: '1,120',
    detail: '80% con actividad reciente',
    icon: ShieldCheck,
    accent: 'text-emerald-400',
  },
  {
    label: 'Nuevos este mes',
    value: '84',
    detail: '+18% vs. el mes pasado',
    icon: Plus,
    accent: 'text-primary',
  },
  {
    label: 'Últimos check-ins',
    value: '312',
    detail: 'Movimientos registrados hoy',
    icon: Clock3,
    accent: 'text-white',
  },
];

function getUserInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function getStatusClasses(status) {
  if (status === 'Activo') {
    return 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
  }

  return 'border border-red-500/20 bg-red-500/10 text-red-400';
}

function getFilterClasses(filter) {
  if (filter.active) {
    return 'border-primary/30 bg-primary/10 text-white';
  }

  if (filter.tone === 'success') {
    return 'border-gray-800 bg-black/30 text-gray-300 hover:border-emerald-500/40 hover:text-white';
  }

  if (filter.tone === 'danger') {
    return 'border-gray-800 bg-black/30 text-gray-300 hover:border-red-500/40 hover:text-white';
  }

  return 'border-gray-800 bg-black/30 text-gray-300 hover:border-primary/30 hover:text-white';
}

export const UsersManagement = () => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  if (isCreatingUser) {
    return <UsersCreateView onBack={() => setIsCreatingUser(false)} />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
              Administración
            </p>
            <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
              Gestión de Usuarios
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Supervisá miembros, actividad reciente y estado de sus planes desde un solo
              frente. El objetivo es detectar rápido quién está entrenando, quién cayó en
              inactividad y dónde intervenir.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-auto lg:min-w-[26rem]">
            {FILTERS.map((filter) => (
              <button
                key={filter.label}
                className={`inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${getFilterClasses(filter)}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o plan..."
                className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-600"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-black/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white">
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
              <button
                onClick={() => setIsCreatingUser(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nuevo usuario
              </button>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Pulso del día
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-white">312</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Check-ins
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-emerald-400">93</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Presentes
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-primary">18</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Alertas
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card
              key={metric.label}
              className="border border-gray-800 bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">
                    {metric.label}
                  </p>
                  <p className={`mt-3 text-3xl font-heading font-bold ${metric.accent}`}>
                    {metric.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-800 bg-surface-light text-gray-400">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400">{metric.detail}</p>
            </Card>
          );
        })}
      </section>

      <Card className="border border-gray-800 bg-surface p-4 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-gray-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
              Roster de miembros
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Vista rápida de usuarios, plan, actividad reciente y acciones disponibles.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.14em] text-gray-400">
            1,400 registros totales
          </div>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {MOCK_USERS.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-gray-800 bg-surface-light p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                    {getUserInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-heading text-base font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                  {user.plan}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                    Último check-in
                  </p>
                  <p className="mt-1 text-sm text-gray-200">{user.lastCheckIn}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(user.status)}`}
                >
                  {user.status}
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white">
                  Editar
                </button>
                <button className="inline-flex h-9 items-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-400 transition-colors hover:border-red-500/40 hover:text-red-300">
                  Desactivar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden md:block">
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-surface-light">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Miembro
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Plan
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Último check-in
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Estado
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-900/70 transition-colors last:border-b-0 hover:bg-black/20"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                          {getUserInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-heading text-base font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{user.lastCheckIn}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white">
                          Editar
                        </button>
                        <button className="inline-flex h-9 items-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-400 transition-colors hover:border-red-500/40 hover:text-red-300">
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UsersManagement;

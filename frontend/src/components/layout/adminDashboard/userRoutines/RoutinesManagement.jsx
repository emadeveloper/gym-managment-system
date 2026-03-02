import React, { useState } from 'react';
import { Card } from '../../../ui/Card';
import { Search, Download, Plus, CalendarClock, Dumbbell, Layers3, Activity } from 'lucide-react';
import { useGymData } from '../../../../context/GymDataContext';
import RoutinesCreateView from './RoutinesCreateView';

const FILTERS = ['Todas', 'Activas', 'Borradores', 'Archivadas'];
const TEMPLATE_ROUTINES = [
  {
    id: 'strength-base',
    name: 'Fuerza Base',
    summary: 'Full body con progresión lineal para subir fuerza útil sin ruido.',
    goal: 'Fuerza',
    level: 'Intermedio',
    duration: '60 min',
    sessionsPerWeek: '3',
    weeks: '6',
    restWindow: '90 seg',
    status: 'Borrador',
    coach: 'Julián Martínez',
    exercises: '8',
    focusArea: 'Full body',
    equipment: 'Barra, rack, mancuernas',
    notesTag: 'Plantilla fuerza base',
    notes: 'Priorizar básicos, sostener técnica y progresar carga semana a semana.',
  },
  {
    id: 'hypertrophy-upper',
    name: 'Hipertrofia Superior',
    summary: 'Bloque para volumen de tren superior con más densidad por sesión.',
    goal: 'Hipertrofia',
    level: 'Avanzado',
    duration: '75 min',
    sessionsPerWeek: '4',
    weeks: '8',
    restWindow: '60-75 seg',
    status: 'Borrador',
    coach: 'Lucía Fernández',
    exercises: '10',
    focusArea: 'Tren superior',
    equipment: 'Mancuernas, polea, banco',
    notesTag: 'Plantilla volumen upper',
    notes: 'Ajustar volumen por fatiga y mantener registros por grupo muscular.',
  },
  {
    id: 'starter-onboarding',
    name: 'Inicio Guiado',
    summary: 'Adaptación para nuevos clientes con técnica, control y adherencia.',
    goal: 'Iniciación',
    level: 'Principiante',
    duration: '45 min',
    sessionsPerWeek: '2',
    weeks: '4',
    restWindow: '60 seg',
    status: 'Borrador',
    coach: 'Julián Martínez',
    exercises: '6',
    focusArea: 'Adaptación general',
    equipment: 'Peso corporal, mancuernas livianas',
    notesTag: 'Plantilla onboarding',
    notes: 'Bajar complejidad, reforzar patrones básicos y revisar tolerancia del cliente.',
  },
];

function getStatusClasses(status) {
  if (status === 'Activa') {
    return 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
  }

  if (status === 'Borrador') {
    return 'border border-yellow-500/20 bg-yellow-500/10 text-yellow-400';
  }

  return 'border border-gray-700 bg-gray-500/10 text-gray-400';
}

function getFilterClasses(filter) {
  if (filter.active) {
    return 'border-primary/30 bg-primary/10 text-white';
  }

  if (filter.tone === 'success') {
    return 'border-gray-800 bg-black/30 text-gray-300 hover:border-emerald-500/40 hover:text-white';
  }

  if (filter.tone === 'warning') {
    return 'border-gray-800 bg-black/30 text-gray-300 hover:border-yellow-500/40 hover:text-white';
  }

  if (filter.tone === 'muted') {
    return 'border-gray-800 bg-black/30 text-gray-300 hover:border-gray-600 hover:text-white';
  }

  return 'border-gray-800 bg-black/30 text-gray-300 hover:border-primary/30 hover:text-white';
}

export const RoutinesManagement = () => {
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todas');
  const { routines } = useGymData();

  const filteredRoutines = routines.filter((routine) => {
    const matchesFilter =
      activeFilter === 'Todas' ||
      (activeFilter === 'Activas' && routine.status === 'Activa') ||
      (activeFilter === 'Borradores' && routine.status === 'Borrador') ||
      (activeFilter === 'Archivadas' && routine.status === 'Archivada');

    if (!matchesFilter) {
      return false;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      routine.name.toLowerCase().includes(normalizedSearch) ||
      routine.goal.toLowerCase().includes(normalizedSearch) ||
      routine.level.toLowerCase().includes(normalizedSearch) ||
      (routine.assignedMemberName || '').toLowerCase().includes(normalizedSearch)
    );
  });

  const activeRoutines = routines.filter((routine) => routine.status === 'Activa').length;
  const assignedRoutines = routines.filter((routine) => routine.assignedMemberEmail).length;
  const weeklyBlocks = routines.reduce(
    (total, routine) => total + Number(routine.sessionsPerWeek || 0),
    0,
  );
  const averageDuration =
    routines.length > 0
      ? Math.round(
          routines.reduce(
            (total, routine) => total + (Number.parseInt(routine.duration, 10) || 0),
            0,
          ) /
            routines.length,
        )
      : 0;
  const metrics = [
    {
      label: 'Rutinas totales',
      value: String(routines.length),
      detail: `${assignedRoutines} con cliente asignado`,
      icon: Layers3,
      accent: 'text-white',
    },
    {
      label: 'Rutinas activas',
      value: String(activeRoutines),
      detail: 'Disponibles para ejecución',
      icon: Activity,
      accent: 'text-emerald-400',
    },
    {
      label: 'Duración promedio',
      value: `${averageDuration || 0} min`,
      detail: 'Promedio de trabajo por sesión',
      icon: CalendarClock,
      accent: 'text-primary',
    },
    {
      label: 'Bloques semanales',
      value: String(weeklyBlocks),
      detail: 'Sesiones programadas por semana',
      icon: Dumbbell,
      accent: 'text-white',
    },
  ];

  if (isCreatingRoutine) {
    return (
      <RoutinesCreateView
        initialData={selectedTemplate}
        onBack={() => {
          setIsCreatingRoutine(false);
          setSelectedTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
            Programación
          </p>
          <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
            Gestión de Rutinas
          </h1>
          <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
            Diseñá, asigná y mantené rutinas con una lectura rápida de carga semanal,
            estado operativo y cliente vinculado desde el mismo frente.
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por rutina, objetivo, nivel o cliente..."
                className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-black/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white">
                <Download className="h-4 w-4" />
                Exportar
              </button>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setIsCreatingRoutine(true);
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nueva rutina
              </button>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Pulso de programación
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-white">{weeklyBlocks}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Bloques
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-emerald-400">{activeRoutines}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Activas
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-primary">{assignedRoutines}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Asignadas
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-gray-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                Plantillas base
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Arrancá desde una estructura probada y personalizala según el cliente, no desde cero.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.14em] text-gray-400">
              {TEMPLATE_ROUTINES.length} bases listas
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {TEMPLATE_ROUTINES.map((template) => (
              <div
                key={template.id}
                className="rounded-3xl border border-gray-800 bg-surface-light p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-heading font-semibold uppercase text-white">
                      {template.name}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-gray-500">
                      {template.goal} · {template.level}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-800 bg-black/20 text-gray-300">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  {template.summary}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                    <p className="uppercase tracking-[0.12em] text-gray-500">Sesiones</p>
                    <p className="mt-1 text-sm text-gray-200">{template.sessionsPerWeek} / sem</p>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                    <p className="uppercase tracking-[0.12em] text-gray-500">Duración</p>
                    <p className="mt-1 text-sm text-gray-200">{template.duration}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsCreatingRoutine(true);
                  }}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary hover:text-white"
                >
                  Usar plantilla
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Cómo usarlo
          </p>
          <div className="mt-4 space-y-3">
            {[
              'Elegí una plantilla base según el objetivo del cliente.',
              'Entrá al formulario con la estructura ya cargada.',
              'Ajustá sesiones, carga, enfoque y observaciones.',
              'Asignala y guardala como rutina operativa.',
            ].map((step) => (
              <div
                key={step}
                className="rounded-2xl border border-gray-800 bg-surface-light px-4 py-3 text-sm text-gray-300"
              >
                {step}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="border border-gray-800 bg-surface p-5">
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
        <div className="flex flex-col gap-4 border-b border-gray-800 pb-4">
          <div>
            <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
              Biblioteca de rutinas
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Controlá plantillas, frecuencia, duración, cliente asignado y estado de cada rutina.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${getFilterClasses({
                    active: activeFilter === filter,
                    tone:
                      filter === 'Activas'
                        ? 'success'
                        : filter === 'Borradores'
                          ? 'warning'
                          : filter === 'Archivadas'
                            ? 'muted'
                            : 'default',
                  })}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.14em] text-gray-400">
              {filteredRoutines.length} rutinas visibles
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {filteredRoutines.map((routine) => (
            <div key={routine.id} className="rounded-2xl border border-gray-800 bg-surface-light p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-base font-semibold text-white">{routine.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                    {routine.goal}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                  {routine.level}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Duración</p>
                  <p className="mt-1 text-sm text-gray-200">{routine.duration}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Sesiones/sem</p>
                  <p className="mt-1 text-sm text-gray-200">{routine.sessionsPerWeek}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Cliente asignado</p>
                <p className="mt-1 text-sm text-gray-200">{routine.assignedMemberName || 'Sin asignar'}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(routine.status)}`}
                >
                  {routine.status}
                </span>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(routine);
                      setIsCreatingRoutine(true);
                    }}
                    className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
                  >
                    Editar
                  </button>
                  <button className="inline-flex h-9 items-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-400 transition-colors hover:border-red-500/40 hover:text-red-300">
                    Archivar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden md:block">
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-surface-light">
            <table className="min-w-[920px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Rutina
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Nivel
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Duración
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Sesiones
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Cliente
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
                {filteredRoutines.map((routine) => (
                  <tr
                    key={routine.id}
                    className="border-b border-gray-900/70 transition-colors last:border-b-0 hover:bg-black/20"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-heading text-base font-semibold text-white">{routine.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                          {routine.goal}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                        {routine.level}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{routine.duration}</td>
                    <td className="px-5 py-4 text-gray-300">{routine.sessionsPerWeek} / sem</td>
                    <td className="px-5 py-4 text-gray-300">
                      {routine.assignedMemberName || 'Sin asignar'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(routine.status)}`}
                      >
                        {routine.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedTemplate(routine);
                            setIsCreatingRoutine(true);
                          }}
                          className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
                        >
                          Editar
                        </button>
                        <button className="inline-flex h-9 items-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-400 transition-colors hover:border-red-500/40 hover:text-red-300">
                          Archivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRoutines.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-800 bg-black/20 px-4 py-8 text-center text-sm text-gray-400">
            No hay rutinas que coincidan con los filtros actuales.
          </div>
        )}
      </Card>
    </div>
  );
};

export default RoutinesManagement;

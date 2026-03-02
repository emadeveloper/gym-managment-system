import React, { useState } from 'react';
import { Card } from '../../../ui/Card';
import { Search, Download, Plus, Salad, Flame, Activity, CalendarClock } from 'lucide-react';
import { useGymData } from '../../../../context/GymDataContext';
import NutritionCreateView from './NutritionCreateView';

const FILTERS = ['Todos', 'Activos', 'Borradores', 'Inactivos'];

function getStatusClasses(status) {
  if (status === 'Activo') {
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

export const NutritionManagement = () => {
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { nutritionPlans } = useGymData();

  const filteredPlans = nutritionPlans.filter((plan) => {
    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Activos' && plan.status === 'Activo') ||
      (activeFilter === 'Borradores' && plan.status === 'Borrador') ||
      (activeFilter === 'Inactivos' && plan.status === 'Inactivo');

    if (!matchesFilter) {
      return false;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      plan.name.toLowerCase().includes(normalizedSearch) ||
      plan.goal.toLowerCase().includes(normalizedSearch) ||
      plan.type.toLowerCase().includes(normalizedSearch) ||
      (plan.assignedMemberName || '').toLowerCase().includes(normalizedSearch)
    );
  });

  const activePlans = nutritionPlans.filter((plan) => plan.status === 'Activo').length;
  const customPlans = nutritionPlans.filter((plan) => plan.type === 'Personalizado').length;
  const averageCalories =
    nutritionPlans.length > 0
      ? Math.round(
          nutritionPlans.reduce((total, plan) => total + Number(plan.calories || 0), 0) /
            nutritionPlans.length,
        )
      : 0;
  const assignedPlans = nutritionPlans.filter((plan) => plan.assignedMemberEmail).length;
  const metrics = [
    {
      label: 'Planes totales',
      value: String(nutritionPlans.length),
      detail: `${assignedPlans} con cliente asignado`,
      icon: Salad,
      accent: 'text-white',
    },
    {
      label: 'Planes activos',
      value: String(activePlans),
      detail: 'Listos para seguimiento',
      icon: Activity,
      accent: 'text-emerald-400',
    },
    {
      label: 'Calorías promedio',
      value: `${averageCalories} kcal`,
      detail: 'Carga media diaria',
      icon: Flame,
      accent: 'text-primary',
    },
    {
      label: 'Próximas revisiones',
      value: String(assignedPlans),
      detail: 'Controles agendados o pendientes',
      icon: CalendarClock,
      accent: 'text-white',
    },
  ];

  if (isCreatingPlan) {
    return (
      <NutritionCreateView
        initialData={selectedPlan}
        onBack={() => {
          setIsCreatingPlan(false);
          setSelectedPlan(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
            Nutrición
          </p>
          <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
            Gestión de Planes Nutricionales
          </h1>
          <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
            Armá, asigná y revisá planes con una lectura rápida de calorías, tipo de plan,
            estado y cliente vinculado.
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
                placeholder="Buscar por plan, objetivo, tipo o cliente..."
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
                  setSelectedPlan(null);
                  setIsCreatingPlan(true);
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nuevo plan
              </button>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Pulso nutricional
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-white">{activePlans}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Activos
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-emerald-400">{assignedPlans}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Asignados
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-primary">{customPlans}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Personalizados
              </p>
            </div>
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
              Biblioteca de planes
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Catálogo de planes disponibles, su carga diaria y el cliente que los recibe.
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
                      filter === 'Activos'
                        ? 'success'
                        : filter === 'Borradores'
                          ? 'warning'
                          : filter === 'Inactivos'
                            ? 'muted'
                            : 'default',
                  })}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.14em] text-gray-400">
              {filteredPlans.length} planes visibles
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-gray-800 bg-surface-light p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-base font-semibold text-white">{plan.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                    {plan.goal}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                  {plan.type}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Calorías</p>
                  <p className="mt-1 text-sm text-gray-200">{plan.calories} kcal</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Revisión</p>
                  <p className="mt-1 text-sm text-gray-200">{plan.reviewDate}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Cliente asignado</p>
                <p className="mt-1 text-sm text-gray-200">{plan.assignedMemberName || 'Sin asignar'}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(plan.status)}`}
                >
                  {plan.status}
                </span>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsCreatingPlan(true);
                    }}
                    className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
                  >
                    Editar
                  </button>
                  <button className="inline-flex h-9 items-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-400 transition-colors hover:border-red-500/40 hover:text-red-300">
                    Desactivar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden md:block">
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-surface-light">
            <table className="min-w-[960px] w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Plan
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Objetivo
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Calorías
                  </th>
                  <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Tipo
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
                {filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-b border-gray-900/70 transition-colors last:border-b-0 hover:bg-black/20"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-heading text-base font-semibold text-white">{plan.name}</p>
                        <p className="mt-1 text-xs text-gray-400">Revisión: {plan.reviewDate}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{plan.goal}</td>
                    <td className="px-5 py-4 text-gray-300">{plan.calories} kcal</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                        {plan.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{plan.assignedMemberName || 'Sin asignar'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(plan.status)}`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            setIsCreatingPlan(true);
                          }}
                          className="inline-flex h-9 items-center rounded-xl border border-gray-800 bg-black/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
                        >
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

        {filteredPlans.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-800 bg-black/20 px-4 py-8 text-center text-sm text-gray-400">
            No hay planes que coincidan con los filtros actuales.
          </div>
        )}
      </Card>
    </div>
  );
};

export default NutritionManagement;

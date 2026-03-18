import React, { Suspense, lazy, useDeferredValue, useMemo, useState } from 'react';
import { Activity, CalendarClock, Flame, Salad } from 'lucide-react';
import { Card } from '../../../ui/Card';
import { useGymData } from '../../../../context/GymDataContext';
import { NutritionForm } from './NutritionForm';
import { NutritionTable } from './NutritionTable';

const FILTERS = ['Todos', 'Activos', 'Borradores', 'Inactivos'];
const NutritionCreateView = lazy(() => import('./NutritionCreateView'));

export const NutritionManagement = () => {
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { nutritionPlans } = useGymData();

  const filteredPlans = useMemo(
    () =>
      nutritionPlans.filter((plan) => {
        const matchesFilter =
          activeFilter === 'Todos' ||
          (activeFilter === 'Activos' && plan.status === 'Activo') ||
          (activeFilter === 'Borradores' && plan.status === 'Borrador') ||
          (activeFilter === 'Inactivos' && plan.status === 'Inactivo');

        if (!matchesFilter) {
          return false;
        }

        const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
        if (!normalizedSearch) {
          return true;
        }

        return (
          plan.name.toLowerCase().includes(normalizedSearch) ||
          plan.goal.toLowerCase().includes(normalizedSearch) ||
          plan.type.toLowerCase().includes(normalizedSearch) ||
          (plan.assignedMemberName || '').toLowerCase().includes(normalizedSearch)
        );
      }),
    [nutritionPlans, activeFilter, deferredSearchTerm],
  );

  const activePlans = nutritionPlans.filter((plan) => plan.status === 'Activo').length;
  const customPlans = nutritionPlans.filter((plan) => plan.type === 'Personalizado').length;
  const assignedPlans = nutritionPlans.filter((plan) => plan.assignedMemberEmail).length;
  const averageCalories =
    nutritionPlans.length > 0
      ? Math.round(
          nutritionPlans.reduce((total, plan) => total + Number(plan.calories || 0), 0) /
            nutritionPlans.length,
        )
      : 0;

  const metrics = useMemo(
    () => [
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
    ],
    [nutritionPlans.length, assignedPlans, activePlans, averageCalories],
  );

  if (isCreatingPlan) {
    return (
      <Suspense fallback={<div className="text-sm text-gray-400">Cargando formulario...</div>}>
        <NutritionCreateView
          initialData={selectedPlan}
          onBack={() => {
            setIsCreatingPlan(false);
            setSelectedPlan(null);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">Nutrición</p>
          <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">Gestión de Planes Nutricionales</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
            Armá, asigná y revisá planes con una lectura rápida de calorías, tipo de plan, estado y cliente vinculado.
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">Pulso nutricional</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-white">{activePlans}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">Activos</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-emerald-400">{assignedPlans}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">Asignados</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-primary">{customPlans}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">Personalizados</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">Promedio</p>
          <p className="mt-3 text-4xl font-heading font-bold text-foreground">{averageCalories} kcal</p>
          <p className="mt-2 text-sm text-gray-400">Media calórica del catálogo actual.</p>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="border border-gray-800 bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">{metric.label}</p>
                  <p className={`mt-3 text-3xl font-heading font-bold ${metric.accent}`}>{metric.value}</p>
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

      <NutritionForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCreate={() => {
          setSelectedPlan(null);
          setIsCreatingPlan(true);
        }}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={FILTERS}
        visibleCount={filteredPlans.length}
      />

      <NutritionTable
        plans={filteredPlans}
        onEdit={(plan) => {
          setSelectedPlan(plan);
          setIsCreatingPlan(true);
        }}
      />
    </div>
  );
};

export default NutritionManagement;

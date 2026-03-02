import React from 'react';
import { Card } from '../../../ui/Card';
import { useGymData } from '../../../../context/GymDataContext';
import {
  Layers3,
  Salad,
  Users,
  CreditCard,
  Activity,
  CalendarClock,
} from 'lucide-react';

const PLAN_VALUES = {
  Bronze: 28000,
  Silver: 36000,
  Gold: 46000,
  Platinum: 62000,
  Pendiente: 0,
};

const PIE_COLORS = ['#cc0000', '#9ca3af', '#4b5563', '#1f2937'];
const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function formatMonthLabel(date) {
  return date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
}

function buildTrendData(totalMembers, activeRoutines, activeNutritionPlans, totalIncome) {
  const currentDate = new Date();
  const months = [3, 2, 1, 0].map((offset) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - offset, 1);
    return formatMonthLabel(date);
  });

  return [
    {
      label: months[0],
      members: Math.max(0, totalMembers - 3),
      routines: Math.max(0, activeRoutines - 1),
      nutrition: Math.max(0, activeNutritionPlans - 1),
      income: Math.round(totalIncome * 0.78),
    },
    {
      label: months[1],
      members: Math.max(0, totalMembers - 2),
      routines: activeRoutines,
      nutrition: Math.max(0, activeNutritionPlans - 1),
      income: Math.round(totalIncome * 0.86),
    },
    {
      label: months[2],
      members: Math.max(0, totalMembers - 1),
      routines: activeRoutines,
      nutrition: activeNutritionPlans,
      income: Math.round(totalIncome * 0.93),
    },
    {
      label: months[3],
      members: totalMembers,
      routines: activeRoutines,
      nutrition: activeNutritionPlans,
      income: totalIncome,
    },
  ];
}

function TrendChart({ data }) {
  const maxIncome = Math.max(...data.map((item) => item.income), 1);
  const chartHeight = 120;
  const usableHeight = 88;
  const lastIndex = Math.max(data.length - 1, 1);
  const points = data
    .map((item, index) => {
      const x = (index / lastIndex) * 100;
      const y = chartHeight - (item.income / maxIncome) * usableHeight - 12;
      return `${x},${y}`;
    })
    .join(' ');
  const areaPoints = `0,${chartHeight} ${points} 100,${chartHeight}`;

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-gray-800 bg-black/20 p-4">
        <div className="pointer-events-none absolute inset-y-4 left-4 right-4 grid grid-rows-4">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-t border-white/[0.05]" />
          ))}
        </div>
        <svg viewBox={`0 0 100 ${chartHeight}`} className="relative z-10 h-full w-full" preserveAspectRatio="none">
          <polygon points={areaPoints} fill="rgba(204, 0, 0, 0.14)" />
          <polyline
            points={points}
            fill="none"
            stroke="#cc0000"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {data.map((item, index) => {
            const x = (index / lastIndex) * 100;
            const y = chartHeight - (item.income / maxIncome) * usableHeight - 12;

            return <circle key={item.label} cx={x} cy={y} r="2.2" fill="#f3f4f6" />;
          })}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {data.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">{item.label}</p>
            <p className="mt-2 text-sm font-semibold text-white">{formatCurrency(item.income)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoverageDonut({ data }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(
    data.reduce((sum, item) => sum + item.value, 0),
    1,
  );
  let accumulated = 0;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-gray-800 bg-black/20">
        <svg viewBox="0 0 100 100" className="h-40 w-40 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
          />
          {data.map((item, index) => {
            const segmentLength = (item.value / total) * circumference;
            const dashArray = `${segmentLength} ${circumference - segmentLength}`;
            const dashOffset = -accumulated * circumference;

            accumulated += item.value / total;

            return (
              <circle
                key={item.name}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={PIE_COLORS[index % PIE_COLORS.length]}
                strokeWidth="14"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Cobertura</p>
          <p className="mt-2 text-3xl font-heading font-bold text-white">{total}</p>
          <p className="mt-1 text-xs text-gray-400">miembros</p>
        </div>
      </div>
    </div>
  );
}

function downloadAnalyticsCsv({ metrics, planBreakdown, totalIncome }) {
  const rows = [
    ['Metrica', 'Valor'],
    ...metrics.map((metric) => [metric.label, metric.exportValue]),
    [],
    ['Plan', 'Miembros', 'Ticket estimado', 'Total Membresias', 'Total del mes'],
    ...planBreakdown.map((row) => [
      row.plan,
      String(row.count),
      String(row.ticket),
      String(row.income),
      '',
    ]),
    ['Total mensual actual', '', '', String(totalIncome), String(totalIncome)],
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'analytics-mensual.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const Analytics = () => {
  const { members, routines, nutritionPlans } = useGymData();

  const totalMembers = members.length;
  const totalRoutines = routines.length;
  const totalNutritionPlans = nutritionPlans.length;
  let activeRoutines = 0;
  let activeNutritionPlans = 0;
  const membersWithRoutine = new Set();
  const membersWithNutrition = new Set();
  const planCounts = {};

  for (const routine of routines) {
    if (routine.status !== 'Activa') {
      continue;
    }

    activeRoutines += 1;

    if (routine.assignedMemberEmail) {
      membersWithRoutine.add(routine.assignedMemberEmail.toLowerCase());
    }
  }

  for (const plan of nutritionPlans) {
    if (plan.status !== 'Activo') {
      continue;
    }

    activeNutritionPlans += 1;

    if (plan.assignedMemberEmail) {
      membersWithNutrition.add(plan.assignedMemberEmail.toLowerCase());
    }
  }

  let totalIncome = 0;
  let membersWithBoth = 0;
  let membersOnlyRoutine = 0;
  let membersOnlyNutrition = 0;

  for (const member of members) {
    const planName = member.plan || 'Pendiente';
    const email = member.email?.toLowerCase() || '';
    const hasRoutine = membersWithRoutine.has(email);
    const hasNutrition = membersWithNutrition.has(email);

    totalIncome += PLAN_VALUES[planName] || 0;
    planCounts[planName] = (planCounts[planName] || 0) + 1;

    if (hasRoutine && hasNutrition) {
      membersWithBoth += 1;
      continue;
    }

    if (hasRoutine) {
      membersOnlyRoutine += 1;
      continue;
    }

    if (hasNutrition) {
      membersOnlyNutrition += 1;
    }
  }

  const membersPending = Math.max(
    0,
    totalMembers - membersWithBoth - membersOnlyRoutine - membersOnlyNutrition,
  );

  const metrics = [
    {
      label: 'Total Rutinas',
      value: String(totalRoutines),
      detail: `${activeRoutines} activas en seguimiento`,
      icon: Layers3,
      accent: 'text-white',
      exportValue: totalRoutines,
    },
    {
      label: 'Total Planes de Nutrición',
      value: String(totalNutritionPlans),
      detail: `${activeNutritionPlans} activos actualmente`,
      icon: Salad,
      accent: 'text-emerald-400',
      exportValue: totalNutritionPlans,
    },
    {
      label: 'Miembros Totales',
      value: String(totalMembers),
      detail: `${membersWithBoth} con rutina y nutrición`,
      icon: Users,
      accent: 'text-white',
      exportValue: totalMembers,
    },
    {
      label: 'Total Membresías',
      value: formatCurrency(totalIncome),
      detail: 'Facturación mensual estimada',
      icon: CreditCard,
      accent: 'text-primary',
      exportValue: totalIncome,
    },
  ];

  const trendData = buildTrendData(
    totalMembers,
    activeRoutines,
    activeNutritionPlans,
    totalIncome,
  );
  const distributionData = [
    { name: 'Rutina + Nutrición', value: membersWithBoth },
    { name: 'Solo rutina', value: membersOnlyRoutine },
    { name: 'Solo nutrición', value: membersOnlyNutrition },
    { name: 'Pendientes', value: membersPending },
  ].filter((item) => item.value > 0);
  const planBreakdown = Object.entries(planCounts).map(([plan, count]) => ({
    plan,
    count,
    ticket: PLAN_VALUES[plan] || 0,
    income: (PLAN_VALUES[plan] || 0) * count,
  }));

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
              Reporte
            </p>
            <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
              Panel de Analytics
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Leé rápido el estado operativo del gimnasio: carga activa, clientes cubiertos
              y volumen económico estimado desde el mismo tablero.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.14em] text-gray-400">
            Corte mensual activo
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                Pulso general
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Estado consolidado de rutinas, nutrición, miembros e ingresos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadAnalyticsCsv({ metrics, planBreakdown, totalIncome })}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
            >
              Exportar CSV
            </button>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Cobertura activa
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-white">{activeRoutines}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Rutinas
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-emerald-400">{activeNutritionPlans}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Nutrición
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-primary">{membersWithBoth}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">
                Completos
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)]">
        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-gray-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                Tendencia operativa
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Evolución del ingreso estimado con el soporte activo del ecosistema.
              </p>
            </div>
            <div className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">
              Últimos 4 meses
            </div>
          </div>

          <div className="mt-5 h-72 rounded-3xl border border-gray-800 bg-surface-light p-3 sm:p-4">
            <TrendChart data={trendData} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Miembros activos</p>
              <p className="mt-2 text-lg font-heading font-bold text-white">{totalMembers}</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Rutinas activas</p>
              <p className="mt-2 text-lg font-heading font-bold text-gray-200">{activeRoutines}</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Planes activos</p>
              <p className="mt-2 text-lg font-heading font-bold text-emerald-400">{activeNutritionPlans}</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="border-b border-gray-800 pb-4">
            <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
              Cobertura por miembro
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Qué tan completo está el servicio asignado hoy.
            </p>
          </div>

          <div className="mt-5 h-72 rounded-3xl border border-gray-800 bg-surface-light p-3 sm:p-4">
            <CoverageDonut data={distributionData} />
          </div>

          <div className="mt-5 space-y-3">
            {distributionData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-gray-800 bg-surface-light px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="border border-gray-800 bg-surface p-4 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-gray-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
              Desglose de membresías
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Ingreso estimado por plan para leer rápido dónde se concentra el negocio.
            </p>
          </div>
          <div className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">
            {planBreakdown.length} planes vigentes
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-800 bg-surface-light">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Plan
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Miembros
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Ticket estimado
                </th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Total Membresías
                </th>
                <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Total del mes
                </th>
              </tr>
            </thead>
            <tbody>
              {planBreakdown.map((row) => (
                <tr
                  key={row.plan}
                  className="border-b border-gray-900/70 transition-colors last:border-b-0 hover:bg-black/20"
                >
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                      {row.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{row.count}</td>
                  <td className="px-5 py-4 text-gray-300">
                    {formatCurrency(PLAN_VALUES[row.plan] || 0)}
                  </td>
                  <td className="px-5 py-4 text-gray-300">
                    {formatCurrency(row.income)}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-500">
                    -
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-800 bg-black/20">
                <td
                  colSpan={3}
                  className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                  Total mensual actual
                </td>
                <td className="px-5 py-4 font-semibold text-white">{formatCurrency(totalIncome)}</td>
                <td className="px-5 py-4 text-right font-semibold text-emerald-400">
                  {formatCurrency(totalIncome)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;

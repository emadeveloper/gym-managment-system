import React from 'react';

function getStatusClasses(status) {
  if (status === 'Activo') {
    return 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
  }

  if (status === 'Borrador') {
    return 'border border-yellow-500/20 bg-yellow-500/10 text-yellow-400';
  }

  return 'border border-gray-700 bg-gray-500/10 text-gray-400';
}

export function NutritionTable({ plans, onEdit }) {
  return (
    <>
      <div className="mt-4 space-y-3 md:hidden">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-gray-800 bg-surface-light p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-base font-semibold text-white">{plan.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">{plan.goal}</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">{plan.type}</span>
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
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(plan.status)}`}>
                {plan.status}
              </span>
              {plan.sourceTemplateId ? (
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                  Desde plantilla
                </span>
              ) : null}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(plan)}
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
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Plan</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Objetivo</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Calorías</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Tipo</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Cliente</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Estado</th>
                <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-gray-900/70 transition-colors last:border-b-0 hover:bg-black/20">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-heading text-base font-semibold text-white">{plan.name}</p>
                      <p className="mt-1 text-xs text-gray-400">Revisión: {plan.reviewDate}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{plan.goal}</td>
                  <td className="px-5 py-4 text-gray-300">{plan.calories} kcal</td>
                  <td className="px-5 py-4"><span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">{plan.type}</span></td>
                  <td className="px-5 py-4 text-gray-300">{plan.assignedMemberName || 'Sin asignar'}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(plan.status)}`}>{plan.status}</span>
                      {plan.sourceTemplateId ? (
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                          Plantilla
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(plan)}
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

      {plans.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-800 bg-black/20 px-4 py-8 text-center text-sm text-gray-400">
          No hay planes que coincidan con los filtros actuales.
        </div>
      ) : null}
    </>
  );
}

export default NutritionTable;

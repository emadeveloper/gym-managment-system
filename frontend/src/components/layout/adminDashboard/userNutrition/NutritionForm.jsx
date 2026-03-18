import React from 'react';
import { Download, Plus, Search } from 'lucide-react';
import { Card } from '../../../ui/Card';

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

export function NutritionForm({
  searchTerm,
  setSearchTerm,
  onCreate,
  activeFilter,
  setActiveFilter,
  filters,
  visibleCount,
}) {
  return (
    <Card className="border border-gray-800 bg-surface p-4 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-gray-800 pb-4">
        <div>
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">Biblioteca de planes</p>
          <p className="mt-2 text-sm text-gray-400">Catálogo de planes disponibles, su carga diaria y el cliente que los recibe.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
              onClick={onCreate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Nuevo plan
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filters.map((filter) => (
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
            {visibleCount} planes visibles
          </div>
        </div>
      </div>
    </Card>
  );
}

export default NutritionForm;

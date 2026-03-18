import React from 'react';
import { Download, Plus, Search } from 'lucide-react';
import { Card } from '../../../ui/Card';

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

export function UsersTable({
  users,
  filters,
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onExportCsv,
  onCreateUser,
  membersCount,
  activeMembers,
  pendingMembers,
}) {
  return (
    <Card className="overflow-hidden border border-gray-800 bg-surface p-4 sm:p-6">
      <div className="relative border-b border-gray-800 pb-5">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_60%)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">Roster de miembros</p>
              <p className="mt-2 text-sm text-gray-400">Vista rápida de usuarios, plan, actividad reciente y acciones disponibles.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onExportCsv}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-black/30 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
              <button
                onClick={onCreateUser}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nuevo usuario
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o plan..."
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-500"
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => onFilterChange(filter.label)}
                  className={`inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${getFilterClasses({
                    ...filter,
                    active: activeFilter === filter.label,
                  })}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-2 text-center">
                <p className="text-base font-heading font-bold text-white">{membersCount}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-gray-500">Miembros</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-2 text-center">
                <p className="text-base font-heading font-bold text-emerald-400">{activeMembers}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-gray-500">Activos</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-2 text-center">
                <p className="text-base font-heading font-bold text-primary">{pendingMembers}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-gray-500">Pendientes</p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.14em] text-gray-400">
              {users.length} registros visibles
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div>
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">Tabla de miembros</p>
          <p className="mt-2 text-sm text-gray-400">Lista detallada con estado de rutinas, nutrición y acciones administrativas.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {users.map((user) => (
          <div key={user.id} className="rounded-2xl border border-gray-800 bg-surface-light p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  {getUserInitials(user.name)}
                </div>
                <div>
                  <p className="font-heading text-base font-semibold text-white">{user.name}</p>
                  <p className="mt-1 text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">{user.plan}</span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Último check-in</p>
                <p className="mt-1 text-sm text-gray-200">{user.lastCheckIn}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(user.status)}`}>
                {user.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Rutina actual</p>
                <p className="mt-1 text-sm text-gray-200">{user.currentRoutine?.name || 'Sin rutina'}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">{user.currentRoutine?.status === 'Activa' ? 'Activa' : 'Inactiva'}</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Plan nutricional</p>
                <p className="mt-1 text-sm text-gray-200">{user.currentNutritionPlan?.name || 'Sin plan'}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">{user.currentNutritionPlan?.status === 'Activo' ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 hidden md:block">
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-surface-light">
          <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Miembro</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Plan</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Último check-in</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Rutina actual</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Estado rutina</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Plan nutricional</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Estado plan</th>
                <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-900/70 transition-colors last:border-b-0 hover:bg-black/20">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                        {getUserInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-heading text-base font-semibold text-white">{user.name}</p>
                        <p className="mt-1 text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">{user.plan}</span></td>
                  <td className="px-5 py-4 text-gray-300">{user.lastCheckIn}</td>
                  <td className="px-5 py-4 text-gray-300">{user.currentRoutine?.name || 'Sin rutina'}</td>
                  <td className="px-5 py-4"><span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">{user.currentRoutine?.status === 'Activa' ? 'Activa' : 'Inactiva'}</span></td>
                  <td className="px-5 py-4 text-gray-300">{user.currentNutritionPlan?.name || 'Sin plan'}</td>
                  <td className="px-5 py-4"><span className="inline-flex items-center rounded-full border border-gray-800 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">{user.currentNutritionPlan?.status === 'Activo' ? 'Activo' : 'Inactivo'}</span></td>
                  <td className="px-5 py-4"><span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(user.status)}`}>{user.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-800 bg-black/20 px-4 py-8 text-center text-sm text-gray-400">
          No hay clientes que coincidan con la búsqueda actual.
        </div>
      )}
    </Card>
  );
}

export default UsersTable;

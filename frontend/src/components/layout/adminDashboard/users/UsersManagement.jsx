import React from 'react';
import { Card } from '../../../ui/Card';

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

export const UsersManagement = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-heading">
            Administración
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Gestión de Usuarios
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Control centralizado de miembros, sus planes y estado de actividad.
          </p>
        </div>

        {/* Filtros rápidos */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-primary/60">
            Todos
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-emerald-500/60">
            Activos
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-red-500/60">
            Inactivos
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <Card className="bg-surface border border-gray-800 px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-gray-800 rounded-lg px-3 py-2">
            <span className="text-gray-500 text-lg">🔎</span>
            <input
              type="text"
              placeholder="Buscar por nombre, email o plan..."
              className="w-full bg-transparent text-sm sm:text-base text-gray-200 placeholder:text-gray-600 outline-none"
            />
          </div>
          <button className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-semibold font-heading text-black hover:brightness-110 transition">
            Nuevo usuario
          </button>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Total Usuarios
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">1,400</p>
          <p className="mt-2 text-xs text-emerald-400">
            +32 <span className="text-gray-500">últimos 30 días</span>
          </p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Usuarios Activos
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400">1,120</p>
          <p className="mt-2 text-xs text-gray-400">80% tasa de actividad</p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Nuevos este mes
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">84</p>
          <p className="mt-2 text-xs text-emerald-400">
            +18% <span className="text-gray-500">vs. mes pasado</span>
          </p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Administradores
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">4</p>
          <p className="mt-2 text-xs text-gray-400">Gestores del panel</p>
        </Card>
      </div>

      {/* TABLA / LISTA DE USUARIOS */}
      <Card className="bg-surface border border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
              Lista de usuarios
            </p>
            <p className="text-sm text-gray-400">
              Vista rápida de miembros y su estado.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-primary/60">
            Exportar CSV
          </button>
        </div>

        {/* VISTA MÓVIL: TARJETAS STACKED (SIN SCROLL HORIZONTAL) */}
        <div className="space-y-3 md:hidden">
          {MOCK_USERS.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-gray-800 bg-surface-light/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-heading font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5 text-[11px] text-gray-200">
                  {user.plan}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <p className="text-gray-400">
                  Último check‑in:{' '}
                  <span className="text-gray-200">{user.lastCheckIn}</span>
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    user.status === 'Activo'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button className="text-[11px] text-primary hover:underline">
                  Editar
                </button>
                <button className="text-[11px] text-red-400 hover:underline">
                  Desactivar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* VISTA DESKTOP: TABLA COMPLETA */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[700px] w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="py-2 pr-4 font-normal">Nombre</th>
                <th className="py-2 pr-4 font-normal">Email</th>
                <th className="py-2 pr-4 font-normal">Plan</th>
                <th className="py-2 pr-4 font-normal">Último check‑in</th>
                <th className="py-2 pr-4 font-normal">Estado</th>
                <th className="py-2 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-black/30 transition-colors">
                  <td className="py-2 pr-4 text-gray-200">{user.name}</td>
                  <td className="py-2 pr-4 text-gray-400">{user.email}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5 text-[11px] text-gray-200">
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-gray-300">{user.lastCheckIn}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        user.status === 'Activo'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-2 text-right space-x-2">
                    <button className="text-xs text-primary hover:underline">
                      Editar
                    </button>
                    <button className="text-xs text-red-400 hover:underline">
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UsersManagement;
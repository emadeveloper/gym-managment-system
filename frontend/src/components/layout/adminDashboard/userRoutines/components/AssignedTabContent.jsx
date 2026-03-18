import React from 'react';
import { Search } from 'lucide-react';
import { Card } from '../../../../ui/Card';

export function AssignedTabContent({ assignedSearch, setAssignedSearch, filteredAssigned }) {
  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-heading font-semibold uppercase tracking-[0.12em] text-white">
        Rutinas Asignadas
      </h2>
      <Card className="border border-gray-800 bg-surface p-5">
        <label className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-black/30 px-4 py-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={assignedSearch}
            onChange={(event) => setAssignedSearch(event.target.value)}
            placeholder="Buscar por rutina, miembro, estado u objetivo"
            className="w-full bg-transparent text-sm text-gray-200"
          />
        </label>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredAssigned.map((routine) => (
          <Card key={routine.id} className="border border-gray-800 bg-surface p-5 text-center">
            <div className="flex flex-col items-center gap-3">
              <div>
                <p className="text-sm font-heading font-semibold uppercase text-white">{routine.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                  {routine.goal} · {routine.level}
                </p>
              </div>
              <span className="rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gray-300">
                {routine.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm text-gray-300">
              <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Miembro</p>
                <p className="mt-1">{routine.assignedMemberName || 'Sin asignar'}</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Fuente</p>
                <p className="mt-1">{routine.sourceTemplateId ? 'Plantilla' : 'Manual'}</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Sesiones</p>
                <p className="mt-1">{routine.sessionsPerWeek} / semana</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-black/20 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">Ejercicios</p>
                <p className="mt-1">{routine.exercises}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

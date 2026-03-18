import React from 'react';
import { Card } from '../../../ui/Card';

export function UserStats({ membersCount, activeMembers, pendingMembers, metrics }) {
  return (
    <>
      <section>
        <Card className="border border-gray-800 bg-surface p-4 sm:p-5">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">Pulso del día</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-white">{membersCount}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">Miembros</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-emerald-400">{activeMembers}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">Activos</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-surface-light px-3 py-3 text-center">
              <p className="text-lg font-heading font-bold text-primary">{pendingMembers}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-gray-500">Pendientes</p>
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
    </>
  );
}

export default UserStats;

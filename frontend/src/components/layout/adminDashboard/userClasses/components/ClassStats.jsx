import React from 'react';
import { Card } from '../../../../ui/Card';

export function ClassStats({ classesCount, totalEnrollments }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border border-gray-800 bg-surface p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Clases cargadas</p>
        <p className="mt-2 text-3xl font-heading font-bold text-foreground">{classesCount}</p>
      </Card>
      <Card className="border border-gray-800 bg-surface p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Inscriptos totales</p>
        <p className="mt-2 text-3xl font-heading font-bold text-primary">{totalEnrollments}</p>
      </Card>
      <Card className="border border-gray-800 bg-surface p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Promedio por clase</p>
        <p className="mt-2 text-3xl font-heading font-bold text-emerald-400">
          {classesCount ? Math.round(totalEnrollments / classesCount) : 0}
        </p>
      </Card>
    </section>
  );
}

export default ClassStats;

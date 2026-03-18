import React from 'react';
import { CalendarDays, Clock3, Users } from 'lucide-react';
import { Card } from '../../../../ui/Card';

export function ClassList({ classesSorted, formatClassDate }) {
  return (
    <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-heading font-bold text-foreground">Clases programadas</h2>
      </div>

      <div className="space-y-3">
        {classesSorted.map((classItem) => {
          const enrolled = classItem.enrollments.length;
          const availableSpots = Math.max(0, classItem.capacity - enrolled);

          return (
            <article key={classItem.id} className="rounded-2xl border border-gray-700 bg-surface-light p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-base font-heading font-bold text-foreground">{classItem.title}</p>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                  {classItem.classType}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
                <p className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                  {formatClassDate(classItem.date)}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                  {classItem.startTime} - {classItem.endTime}
                </p>
              </div>

              <p className="mt-2 text-sm text-gray-400">{classItem.name} · Coach: {classItem.coach}</p>
              <p className="mt-2 text-sm text-gray-300">{classItem.description}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-700 pt-3 text-xs uppercase tracking-[0.12em] text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                  Inscriptos: {enrolled}
                </span>
                <span className={availableSpots > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  Cupos disponibles: {availableSpots}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}

export default ClassList;

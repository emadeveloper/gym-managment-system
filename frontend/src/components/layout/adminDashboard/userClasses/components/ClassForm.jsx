import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../../../../ui/Card';
import { Button } from '../../../../ui/Button';

export function ClassForm({ formData, saving, onChange, onSubmit }) {
  return (
    <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-heading font-bold text-foreground">Nueva clase</h2>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Fecha</span>
          <input type="date" name="date" value={formData.date} onChange={onChange} className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Título</span>
          <input type="text" name="title" value={formData.title} onChange={onChange} placeholder="Ej: Potencia funcional" className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Horario inicio</span>
          <input type="time" name="startTime" value={formData.startTime} onChange={onChange} className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Horario fin</span>
          <input type="time" name="endTime" value={formData.endTime} onChange={onChange} className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Nombre de clase</span>
          <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Ej: Functional Training" className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Tipo</span>
          <input type="text" name="classType" value={formData.classType} onChange={onChange} placeholder="Ej: Fuerza + cardio" className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Coach</span>
          <input type="text" name="coach" value={formData.coach} onChange={onChange} placeholder="Ej: Sofía Herrera" className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Capacidad</span>
          <input type="number" name="capacity" min="1" value={formData.capacity} onChange={onChange} className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Descripción breve</span>
          <textarea name="description" value={formData.description} onChange={onChange} rows={3} placeholder="Resumen de la dinámica y objetivo de la clase" className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40" required />
        </label>

        <Button type="submit" loading={saving} className="sm:col-span-2 min-h-11 w-full text-sm uppercase font-heading">
          Publicar clase
        </Button>
      </form>
    </Card>
  );
}

export default ClassForm;

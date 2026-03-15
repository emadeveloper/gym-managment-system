import React, { useMemo, useState } from 'react';
import { CalendarDays, Clock3, Plus, Users } from 'lucide-react';
import { Card } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { useGymData } from '../../../../context/GymDataContext';
import { useToast } from '../../../../hooks/useToast';

const initialFormState = {
  date: '',
  startTime: '',
  endTime: '',
  name: '',
  title: '',
  classType: '',
  coach: '',
  description: '',
  capacity: '16',
};

function formatClassDate(dateValue) {
  const parsedDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export const ClassesManagement = () => {
  const { classes, addClass } = useGymData();
  const toast = useToast();
  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);

  const classesSorted = useMemo(
    () =>
      [...classes].sort((first, second) =>
        `${first.date}T${first.startTime}`.localeCompare(`${second.date}T${second.startTime}`),
      ),
    [classes],
  );

  const totalEnrollments = useMemo(
    () => classes.reduce((total, classItem) => total + classItem.enrollments.length, 0),
    [classes],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await addClass(formData);
      setFormData(initialFormState);
      toast.success('La clase se creó correctamente.', 'Clase publicada');
    } catch (error) {
      toast.error(error.message || 'No se pudo crear la clase.', 'Error al crear clase');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">Programación grupal</p>
        <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
          Gestión de Clases
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
          Creá clases con fecha y horario, seguí ocupación en tiempo real y revisá cuántos miembros se
          inscribieron en cada bloque.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border border-gray-800 bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Clases cargadas</p>
          <p className="mt-2 text-3xl font-heading font-bold text-foreground">{classes.length}</p>
        </Card>
        <Card className="border border-gray-800 bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Inscriptos totales</p>
          <p className="mt-2 text-3xl font-heading font-bold text-primary">{totalEnrollments}</p>
        </Card>
        <Card className="border border-gray-800 bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Promedio por clase</p>
          <p className="mt-2 text-3xl font-heading font-bold text-emerald-400">
            {classes.length ? Math.round(totalEnrollments / classes.length) : 0}
          </p>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-heading font-bold text-foreground">Nueva clase</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Fecha</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Título</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Potencia funcional"
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Horario inicio</span>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Horario fin</span>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Nombre de clase</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Functional Training"
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Tipo</span>
              <input
                type="text"
                name="classType"
                value={formData.classType}
                onChange={handleChange}
                placeholder="Ej: Fuerza + cardio"
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Coach</span>
              <input
                type="text"
                name="coach"
                value={formData.coach}
                onChange={handleChange}
                placeholder="Ej: Sofía Herrera"
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Capacidad</span>
              <input
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Descripción breve</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Resumen de la dinámica y objetivo de la clase"
                className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                required
              />
            </label>

            <Button
              type="submit"
              loading={saving}
              className="sm:col-span-2 min-h-11 w-full text-sm uppercase font-heading"
            >
              Publicar clase
            </Button>
          </form>
        </Card>

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
                <article
                  key={classItem.id}
                  className="rounded-2xl border border-gray-700 bg-surface-light p-4"
                >
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
      </section>
    </div>
  );
};

export default ClassesManagement;

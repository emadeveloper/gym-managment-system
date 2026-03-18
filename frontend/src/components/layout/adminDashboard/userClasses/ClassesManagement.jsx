import React, { useMemo, useState } from 'react';
import { useGymData } from '../../../../context/GymDataContext';
import { useToast } from '../../../../hooks/useToast';
import { ClassForm } from './components/ClassForm';
import { ClassList } from './components/ClassList';
import { ClassStats } from './components/ClassStats';

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

      <ClassStats classesCount={classes.length} totalEnrollments={totalEnrollments} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <ClassForm formData={formData} saving={saving} onChange={handleChange} onSubmit={handleSubmit} />
        <ClassList classesSorted={classesSorted} formatClassDate={formatClassDate} />
      </section>
    </div>
  );
};

export default ClassesManagement;

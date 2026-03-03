import React, { useMemo, useState } from 'react';
import { ArrowLeft, Save, ClipboardPlus, CalendarClock, Dumbbell } from 'lucide-react';
import { Card } from '../../../ui/Card';
import { useGymData } from '../../../../context/GymDataContext';

const EMPTY_FORM = {
  name: '',
  assignedMemberEmail: '',
  goal: '',
  level: '',
  duration: '',
  sessionsPerWeek: '',
  weeks: '',
  restWindow: '',
  status: '',
  coach: '',
  exercises: '',
  focusArea: '',
  equipment: '',
  notesTag: '',
  notes: '',
};

const FIELD_GROUPS = [
  {
    title: 'Base de la rutina',
    description: 'Definí el marco general de trabajo y a quién está dirigida.',
    fields: [
      { name: 'name', label: 'Nombre de la rutina', type: 'text', placeholder: 'Fuerza Full Body' },
      { name: 'assignedMemberEmail', label: 'Asignar a cliente', type: 'member-select' },
      {
        name: 'goal',
        label: 'Objetivo principal',
        type: 'select',
        options: ['Fuerza', 'Hipertrofia', 'Resistencia', 'Recomposición', 'Iniciación'],
      },
      {
        name: 'level',
        label: 'Nivel',
        type: 'select',
        options: ['Principiante', 'Intermedio', 'Avanzado'],
      },
      { name: 'duration', label: 'Duración por sesión', type: 'text', placeholder: '60 min' },
    ],
  },
  {
    title: 'Carga y calendario',
    description: 'Frecuencia, bloques y tiempos para sostener la progresión.',
    fields: [
      { name: 'sessionsPerWeek', label: 'Sesiones por semana', type: 'number', placeholder: '3' },
      { name: 'weeks', label: 'Duración del bloque (semanas)', type: 'number', placeholder: '6' },
      { name: 'restWindow', label: 'Descanso estimado', type: 'text', placeholder: '60-90 seg' },
      {
        name: 'status',
        label: 'Estado inicial',
        type: 'select',
        options: ['Activa', 'Borrador', 'Archivada'],
      },
    ],
  },
  {
    title: 'Asignación',
    description: 'Datos operativos para dejar lista la plantilla.',
    fields: [
      { name: 'coach', label: 'Coach responsable', type: 'text', placeholder: 'Julián Martínez' },
      { name: 'exercises', label: 'Ejercicios estimados', type: 'number', placeholder: '8' },
      { name: 'focusArea', label: 'Zona de enfoque', type: 'text', placeholder: 'Full body / Tren superior / Core' },
      { name: 'equipment', label: 'Equipamiento clave', type: 'text', placeholder: 'Mancuernas, barra, polea' },
      { name: 'notesTag', label: 'Etiqueta interna', type: 'text', placeholder: 'Plantilla base junio' },
    ],
  },
];

function Field({ field, value, onChange, members }) {
  const baseClassName =
    'h-12 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/40';

  if (field.type === 'member-select') {
    return (
      <select name={field.name} value={value} onChange={onChange} className={baseClassName}>
        <option value="" disabled className="text-gray-400">
          Seleccionar cliente
        </option>
        {members.map((member) => (
          <option key={member.id} value={member.email} className="text-gray-100">
            {member.name} · {member.email}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'select') {
    return (
      <select name={field.name} value={value} onChange={onChange} className={baseClassName}>
        <option value="" disabled className="text-gray-400">
          Seleccionar
        </option>
        {field.options.map((option) => (
          <option key={option} value={option} className="text-gray-100">
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      name={field.name}
      type={field.type}
      value={value}
      onChange={onChange}
      placeholder={field.placeholder}
      className={baseClassName}
    />
  );
}

export default function RoutinesCreateView({ onBack, initialData = null }) {
  const { members, addRoutine } = useGymData();
  const isEditing = Boolean(initialData?.id);
  const [formData, setFormData] = useState(() => ({
    ...EMPTY_FORM,
    ...initialData,
  }));
  const [submitError, setSubmitError] = useState('');

  const assignableMembers = useMemo(
    () => members.filter((member) => member.status !== 'Inactivo'),
    [members],
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!formData.name || !formData.assignedMemberEmail || !formData.goal || !formData.level) {
      setSubmitError('Completá los datos base antes de guardar la rutina.');
      return;
    }

    try {
      await addRoutine(formData);
      onBack();
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'No se pudo guardar la rutina.');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
              Programación
            </p>
            <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
              {isEditing ? 'Editar Rutina' : initialData ? 'Personalizar Plantilla' : 'Alta de Nueva Rutina'}
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              {isEditing
                ? 'Ajustá la rutina existente en tiempo real y guardá los cambios sin salir del flujo operativo.'
                : initialData
                  ? 'Partí de una base ya estructurada, ajustá la carga según el cliente y guardá una versión lista para ejecutar.'
                  : 'Configurá una nueva rutina con objetivo, frecuencia y estructura clara para que el equipo pueda asignarla o iterarla sin rehacer la base.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al listado
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <ClipboardPlus className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                Flujo de armado
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-400">
                Ordená el objetivo, fijá la carga semanal, asigná el cliente correcto y dejá
                la rutina lista para que el coach solo tenga que iterar progresiones.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Checklist
          </p>
          <div className="mt-4 space-y-3">
            {['Cliente asignado', 'Objetivo definido', 'Carga semanal fijada', 'Plantilla lista'].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-gray-800 bg-surface-light px-4 py-3"
              >
                <span className="text-sm text-gray-300">{item}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {submitError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {submitError}
          </div>
        ) : null}
        {FIELD_GROUPS.map((group) => (
          <Card key={group.title} className="border border-gray-800 bg-surface p-5 sm:p-6">
            <div className="border-b border-gray-800 pb-4">
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                {group.title}
              </p>
              <p className="mt-2 text-sm text-gray-400">{group.description}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    {field.label}
                  </label>
                  <Field
                    field={field}
                    value={formData[field.name]}
                    onChange={handleFieldChange}
                    members={assignableMembers}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 text-gray-300">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-heading uppercase tracking-[0.16em] text-gray-500">
                  Calendario
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Prepará la rutina para ciclos semanales consistentes y revisiones simples.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 text-gray-300">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-heading uppercase tracking-[0.16em] text-gray-500">
                  Estructura
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Dejá claro el marco para que los ejercicios se carguen sin perder lógica.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Observaciones internas
                </label>
                <textarea
                  rows={5}
                  name="notes"
                  value={formData.notes}
                  onChange={handleFieldChange}
                  placeholder="Notas para coaches, ajustes, progresiones sugeridas, restricciones..."
                  className="w-full rounded-2xl border border-gray-800 bg-black/25 px-4 py-3 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/40"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300 transition-colors hover:border-primary/30 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90"
                >
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Actualizar rutina' : 'Guardar rutina'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

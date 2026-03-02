import React, { useMemo, useState } from 'react';
import { ArrowLeft, Save, Salad, CalendarClock, ClipboardList } from 'lucide-react';
import { Card } from '../../../ui/Card';
import { useGymData } from '../../../../context/GymDataContext';

const FIELD_GROUPS = [
  {
    title: 'Base del plan',
    description: 'Definí el plan, el objetivo y a quién se asigna.',
    fields: [
      { name: 'name', label: 'Nombre del plan', type: 'text', placeholder: 'Déficit controlado' },
      { name: 'assignedMemberEmail', label: 'Asignar a cliente', type: 'member-select' },
      {
        name: 'goal',
        label: 'Objetivo principal',
        type: 'select',
        options: ['Pérdida de grasa', 'Hipertrofia', 'Mantenimiento', 'Rendimiento', 'Bienestar general'],
      },
      {
        name: 'type',
        label: 'Tipo de plan',
        type: 'select',
        options: ['Personalizado', 'Estándar', 'Plantilla'],
      },
    ],
  },
  {
    title: 'Macros y control',
    description: 'Configurá calorías, macros y fecha de revisión.',
    fields: [
      { name: 'calories', label: 'Calorías diarias', type: 'number', placeholder: '2200' },
      { name: 'protein', label: 'Proteína (g)', type: 'number', placeholder: '150' },
      { name: 'carbs', label: 'Carbohidratos (g)', type: 'number', placeholder: '220' },
      { name: 'fat', label: 'Grasas (g)', type: 'number', placeholder: '75' },
      { name: 'reviewDate', label: 'Próxima revisión', type: 'date' },
      {
        name: 'status',
        label: 'Estado inicial',
        type: 'select',
        options: ['Activo', 'Borrador', 'Inactivo'],
      },
    ],
  },
  {
    title: 'Contexto operativo',
    description: 'Señales para el seguimiento del coach o nutricionista.',
    fields: [
      {
        name: 'activityLevel',
        label: 'Nivel de actividad',
        type: 'select',
        options: ['Bajo', 'Moderado', 'Alto'],
      },
      { name: 'restrictions', label: 'Restricciones (coma separada)', type: 'text', placeholder: 'Sin gluten, Sin lácteos' },
      { name: 'supplements', label: 'Suplementos (coma separada)', type: 'text', placeholder: 'Creatina, Vitamina D3' },
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

function formatInputDate(value) {
  if (!value || value === 'Pendiente' || value === 'Sin revisión') {
    return '';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString().slice(0, 10);
}

function buildInitialFormData(initialData) {
  if (!initialData) {
    return {
      name: '',
      assignedMemberEmail: '',
      goal: '',
      type: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      reviewDate: '',
      status: '',
      activityLevel: '',
      restrictions: '',
      supplements: '',
      tips: '',
      createdDate: '',
    };
  }

  return {
    id: initialData.id,
    name: initialData.name || '',
    assignedMemberEmail: initialData.assignedMemberEmail || '',
    goal: initialData.goal || '',
    type: initialData.type || '',
    calories: String(initialData.calories || ''),
    protein: String(initialData.nutritionData?.dailyMacros?.protein || ''),
    carbs: String(initialData.nutritionData?.dailyMacros?.carbs || ''),
    fat: String(initialData.nutritionData?.dailyMacros?.fat || ''),
    reviewDate: formatInputDate(initialData.reviewDate || initialData.nutritionData?.nextReview),
    status: initialData.status || '',
    activityLevel: initialData.nutritionData?.user?.activityLevel || '',
    restrictions: (initialData.nutritionData?.restrictions || []).join(', '),
    supplements: (initialData.nutritionData?.supplements || []).join(', '),
    tips: (initialData.nutritionData?.tips || []).join('\n'),
    createdDate: initialData.nutritionData?.createdDate || '',
  };
}

export default function NutritionCreateView({ onBack, initialData = null }) {
  const { members, addNutritionPlan } = useGymData();
  const isEditing = Boolean(initialData?.id);
  const [formData, setFormData] = useState(() => buildInitialFormData(initialData));

  const assignableMembers = useMemo(
    () => members.filter((member) => member.status !== 'Inactivo'),
    [members],
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.assignedMemberEmail || !formData.goal) {
      return;
    }

    addNutritionPlan(formData);
    onBack();
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
              Nutrición
            </p>
            <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
              {isEditing ? 'Editar Plan Nutricional' : 'Alta de Nuevo Plan'}
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              {isEditing
                ? 'Ajustá macros, revisión y soporte del plan existente con impacto inmediato en el dashboard del cliente.'
                : 'Cargá macros, revisión, restricciones y dejá el plan asignado al cliente correcto desde una sola pantalla.'}
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
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                Flujo nutricional
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-400">
                Armá el plan, definí el control y dejalo disponible para el cliente sin salir del módulo.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Checklist
          </p>
          <div className="mt-4 space-y-3">
            {['Cliente asignado', 'Macros definidos', 'Revisión cargada', 'Plan listo'].map((item) => (
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
                  Revisión
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Dejá programado el próximo control para sostener el seguimiento.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-800 bg-black/25 text-gray-300">
                  <Salad className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-heading uppercase tracking-[0.16em] text-gray-500">
                  Ajustes
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Sumá observaciones claras para evitar rehacer el plan en cada ajuste.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  Recomendaciones internas
                </label>
                <textarea
                  rows={5}
                  name="tips"
                  value={formData.tips}
                  onChange={handleFieldChange}
                  placeholder="Una recomendación por línea para el cliente..."
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
                  {isEditing ? 'Actualizar plan' : 'Guardar plan'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

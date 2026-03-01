import React from 'react';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { Card } from '../../../ui/Card';

const FIELD_GROUPS = [
  {
    title: 'Identidad',
    description: 'Datos base para registrar y reconocer al miembro.',
    fields: [
      { name: 'firstName', label: 'Nombre', type: 'text', placeholder: 'Juan' },
      { name: 'lastName', label: 'Apellido', type: 'text', placeholder: 'Pérez' },
      { name: 'dni', label: 'DNI', type: 'text', placeholder: '30123456' },
      { name: 'birthDate', label: 'Fecha de nacimiento', type: 'date' },
    ],
  },
  {
    title: 'Contacto',
    description: 'Canales de comunicación y contacto de emergencia.',
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'cliente@email.com' },
      { name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '+54 11 5555 5555' },
      {
        name: 'emergencyName',
        label: 'Contacto de emergencia',
        type: 'text',
        placeholder: 'María Pérez',
      },
      {
        name: 'emergencyPhone',
        label: 'Teléfono de emergencia',
        type: 'tel',
        placeholder: '+54 11 4444 4444',
      },
    ],
  },
  {
    title: 'Membresía',
    description: 'Configuración del alta, plan y estado operativo.',
    fields: [
      {
        name: 'plan',
        label: 'Plan',
        type: 'select',
        options: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      },
      {
        name: 'status',
        label: 'Estado inicial',
        type: 'select',
        options: ['Activo', 'Pendiente', 'Inactivo'],
      },
      { name: 'startDate', label: 'Fecha de alta', type: 'date' },
      {
        name: 'paymentMethod',
        label: 'Método de pago',
        type: 'select',
        options: ['Efectivo', 'Tarjeta', 'Transferencia', 'Débito automático'],
      },
    ],
  },
];

function Field({ field }) {
  const baseClassName =
    'h-12 w-full rounded-2xl border border-gray-800 bg-black/25 px-4 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/40';

  if (field.type === 'select') {
    return (
      <select name={field.name} defaultValue="" className={baseClassName}>
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
      placeholder={field.placeholder}
      className={baseClassName}
    />
  );
}

export default function UsersCreateView({ onBack }) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
              Administración
            </p>
            <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
              Alta de Nuevo Cliente
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Cargá todos los datos del nuevo miembro, definí su plan y dejá listo el alta
              para que el equipo pueda activar su seguimiento sin volver a editar.
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                Flujo de alta
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-400">
                Registrá identidad, contacto y membresía en una sola pasada. Los campos
                están organizados para evitar saltos innecesarios entre datos personales y
                comerciales.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
            Checklist
          </p>
          <div className="mt-4 space-y-3">
            {['Identidad confirmada', 'Contacto cargado', 'Plan asignado', 'Alta registrada'].map((item) => (
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

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        {FIELD_GROUPS.map((group) => (
          <Card
            key={group.title}
            className="border border-gray-800 bg-surface p-5 sm:p-6"
          >
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
                  <Field field={field} />
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                Observaciones internas
              </label>
              <textarea
                rows={5}
                placeholder="Notas para el equipo, restricciones médicas, seguimiento inicial..."
                className="w-full rounded-2xl border border-gray-800 bg-black/25 px-4 py-3 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-400 focus:border-primary/40"
              />
            </div>

            <div className="space-y-4 rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
              <p className="text-xs font-heading uppercase tracking-[0.2em] text-gray-500">
                Confirmación
              </p>
              <p className="text-sm leading-7 text-gray-400">
                Al guardar, el cliente quedará listo para asignación operativa y seguimiento
                administrativo. Esta vista está preparada para conectarse luego con la API de
                alta real.
              </p>
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
                  Guardar cliente
                </button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

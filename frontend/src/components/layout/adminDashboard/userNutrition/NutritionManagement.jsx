import { Card } from "../../../ui/Card";

const MOCK_PLANS = [
  {
    id: 1,
    name: "Déficit controlado",
    goal: "Pérdida de grasa",
    calories: "1,800 kcal",
    type: "Estándar",
    status: "Activo",
  },
  {
    id: 2,
    name: "Ganancia limpia",
    goal: "Hipertrofia",
    calories: "2,600 kcal",
    type: "Estándar",
    status: "Activo",
  },
  {
    id: 3,
    name: "Inicio saludable",
    goal: "Bienestar general",
    calories: "2,100 kcal",
    type: "Plantilla",
    status: "Borrador",
  },
  {
    id: 4,
    name: "Alto rendimiento",
    goal: "Rendimiento",
    calories: "2,900 kcal",
    type: "Personalizado",
    status: "Inactivo",
  },
];

export const NutritionManagement = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-heading">
            Nutrición
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Gestión de Planes Nutricionales
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Diseña planes alimenticios alineados con los objetivos de tus miembros.
          </p>
        </div>

        {/* Filtros rápidos */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-primary/60">
            Todos
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-emerald-500/60">
            Activos
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-yellow-400/60">
            Borradores
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <Card className="bg-surface border border-gray-800 px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-gray-800 rounded-lg px-3 py-2">
            <span className="text-gray-500 text-lg">🔎</span>
            <input
              type="text"
              placeholder="Buscar por nombre de plan, objetivo o tipo..."
              className="w-full bg-transparent text-sm sm:text-base text-gray-200 placeholder:text-gray-600 outline-none"
            />
          </div>
          <button className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-semibold font-heading text-black hover:brightness-110 transition">
            Nuevo plan
          </button>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Planes Totales
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">18</p>
          <p className="mt-2 text-xs text-emerald-400">
            +3 <span className="text-gray-500">este mes</span>
          </p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Planes Activos
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400">12</p>
          <p className="mt-2 text-xs text-gray-400">Asignados actualmente</p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Calorías Promedio
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">2,150 kcal</p>
          <p className="mt-2 text-xs text-gray-400">Entre planes activos</p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Planes Personalizados
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">5</p>
          <p className="mt-2 text-xs text-gray-400">Adaptados a atletas</p>
        </Card>
      </div>

      {/* TABLA / LISTA DE PLANES */}
      <Card className="bg-surface border border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
              Planes configurados
            </p>
            <p className="text-sm text-gray-400">
              Catálogo de planes disponibles para asignar.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-primary/60">
            Exportar
          </button>
        </div>

        {/* VISTA MÓVIL: TARJETAS STACKED */}
        <div className="space-y-3 md:hidden">
          {MOCK_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-gray-800 bg-surface-light/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-heading font-semibold text-foreground">
                  {plan.name}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5 text-[11px] text-gray-200">
                  {plan.type}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <p className="text-gray-400">
                  Objetivo:{' '}
                  <span className="text-gray-200">{plan.goal}</span>
                </p>
                <p className="text-gray-400">
                  Calorías:{' '}
                  <span className="text-gray-200">{plan.calories}</span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1 text-xs">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    plan.status === 'Activo'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : plan.status === 'Borrador'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {plan.status}
                </span>
                <div className="flex justify-end gap-3">
                  <button className="text-[11px] text-primary hover:underline">
                    Editar
                  </button>
                  <button className="text-[11px] text-red-400 hover:underline">
                    Desactivar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VISTA DESKTOP: TABLA COMPLETA */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[700px] w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="py-2 pr-4 font-normal">Nombre</th>
                <th className="py-2 pr-4 font-normal">Objetivo</th>
                <th className="py-2 pr-4 font-normal">Calorías</th>
                <th className="py-2 pr-4 font-normal">Tipo</th>
                <th className="py-2 pr-4 font-normal">Estado</th>
                <th className="py-2 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {MOCK_PLANS.map((plan) => (
                <tr key={plan.id} className="hover:bg-black/30 transition-colors">
                  <td className="py-2 pr-4 text-gray-200">{plan.name}</td>
                  <td className="py-2 pr-4 text-gray-300">{plan.goal}</td>
                  <td className="py-2 pr-4 text-gray-300">{plan.calories}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5 text-[11px] text-gray-200">
                      {plan.type}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        plan.status === "Activo"
                          ? "bg-emerald-500/10 text-emerald-400"
                        : plan.status === "Borrador"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="py-2 text-right space-x-2">
                    <button className="text-xs text-primary hover:underline">
                      Editar
                    </button>
                    <button className="text-xs text-red-400 hover:underline">
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default NutritionManagement;
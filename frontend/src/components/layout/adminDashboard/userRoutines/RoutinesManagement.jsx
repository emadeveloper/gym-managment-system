import { Card } from "../../../ui/Card";

const MOCK_ROUTINES = [
  {
    id: 1,
    name: "Fuerza Full Body",
    level: "Intermedio",
    duration: "60 min",
    sessionsPerWeek: 3,
    status: "Activa",
  },
  {
    id: 2,
    name: "Hipertrofia Tren Superior",
    level: "Avanzado",
    duration: "75 min",
    sessionsPerWeek: 4,
    status: "Activa",
  },
  {
    id: 3,
    name: "Inicio en el Gym",
    level: "Principiante",
    duration: "45 min",
    sessionsPerWeek: 2,
    status: "Borrador",
  },
  {
    id: 4,
    name: "Cardio & Core",
    level: "Intermedio",
    duration: "40 min",
    sessionsPerWeek: 3,
    status: "Archivada",
  },
];

export const RoutinesManagement = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-heading">
            Programación
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Gestión de Rutinas
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Diseña y organiza rutinas de entrenamiento para tus miembros.
          </p>
        </div>

        {/* Filtros rápidos */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-primary/60">
            Todas
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-emerald-500/60">
            Activas
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
              placeholder="Buscar por nombre de rutina, nivel o duración..."
              className="w-full bg-transparent text-sm sm:text-base text-gray-200 placeholder:text-gray-600 outline-none"
            />
          </div>
          <button className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-semibold font-heading text-black hover:brightness-110 transition">
            Nueva rutina
          </button>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Rutinas Totales
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">32</p>
          <p className="mt-2 text-xs text-emerald-400">
            +5 <span className="text-gray-500">este mes</span>
          </p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Rutinas Activas
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-emerald-400">21</p>
          <p className="mt-2 text-xs text-gray-400">Disponibles para asignar</p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Duración Promedio
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">58 min</p>
          <p className="mt-2 text-xs text-gray-400">Entre todas las rutinas activas</p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-1">
            Plantillas
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">8</p>
          <p className="mt-2 text-xs text-gray-400">Para crear rutinas rápidas</p>
        </Card>
      </div>

      {/* TABLA / LISTA DE RUTINAS */}
      <Card className="bg-surface border border-gray-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
              Rutinas configuradas
            </p>
            <p className="text-sm text-gray-400">
              Gestiona la programación de entrenamientos.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-black/40 border border-gray-800 px-3 py-1.5 text-xs sm:text-sm text-gray-300 hover:border-primary/60">
            Exportar
          </button>
        </div>

        {/* VISTA MÓVIL: TARJETAS STACKED */}
        <div className="space-y-3 md:hidden">
          {MOCK_ROUTINES.map((routine) => (
            <div
              key={routine.id}
              className="rounded-xl border border-gray-800 bg-surface-light/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-heading font-semibold text-foreground">
                  {routine.name}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5 text-[11px] text-gray-200">
                  {routine.level}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <p className="text-gray-400">
                  Duración:{' '}
                  <span className="text-gray-200">{routine.duration}</span>
                </p>
                <p className="text-gray-400">
                  Sesiones/sem:{' '}
                  <span className="text-gray-200">
                    {routine.sessionsPerWeek}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    routine.status === 'Activa'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : routine.status === 'Borrador'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {routine.status}
                </span>
                <div className="flex justify-end gap-3">
                  <button className="text-[11px] text-primary hover:underline">
                    Editar
                  </button>
                  <button className="text-[11px] text-red-400 hover:underline">
                    Archivar
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
                <th className="py-2 pr-4 font-normal">Nivel</th>
                <th className="py-2 pr-4 font-normal">Duración</th>
                <th className="py-2 pr-4 font-normal">Sesiones/sem</th>
                <th className="py-2 pr-4 font-normal">Estado</th>
                <th className="py-2 font-normal text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {MOCK_ROUTINES.map((routine) => (
                <tr key={routine.id} className="hover:bg-black/30 transition-colors">
                  <td className="py-2 pr-4 text-gray-200">{routine.name}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5 text-[11px] text-gray-200">
                      {routine.level}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-gray-300">{routine.duration}</td>
                  <td className="py-2 pr-4 text-gray-300">{routine.sessionsPerWeek}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        routine.status === "Activa"
                          ? "bg-emerald-500/10 text-emerald-400"
                        : routine.status === "Borrador"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {routine.status}
                    </span>
                  </td>
                  <td className="py-2 text-right space-x-2">
                    <button className="text-xs text-primary hover:underline">
                      Editar
                    </button>
                    <button className="text-xs text-red-400 hover:underline">
                      Archivar
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

export default RoutinesManagement;
import { Card } from "../../../ui/Card";

/**
 * Analytics
 * Inspirado en el diseño de la imagen de referencia,
 * manteniendo la paleta oscura + acentos de color actuales.
 */
export const Analytics = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ENCABEZADO + ACCIONES */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-heading">
            Reporte
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Panel de Analytics
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Resumen visual del rendimiento de tu gimnasio y miembros.
          </p>
        </div>

        {/* Selector de fecha */}
        <div className="flex justify-start lg:justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-surface px-3 py-2 text-xs sm:text-sm text-gray-300 hover:border-primary/60 hover:bg-surface-light transition-colors">
            <span>Rango de fechas</span>
            <span className="text-gray-500">▼</span>
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <Card className="bg-surface border border-gray-800 px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-black/40 border border-gray-800 rounded-lg px-3 py-2">
            <span className="text-gray-500 text-lg">🔎</span>
            <input
              type="text"
              placeholder="Buscar reportes, usuarios o métricas..."
              className="w-full bg-transparent text-sm sm:text-base text-gray-200 placeholder:text-gray-600 outline-none"
            />
          </div>
          <button className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-semibold font-heading text-black hover:brightness-110 transition">
            Buscar
          </button>
        </div>
      </Card>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-surface border border-gray-800 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
              Ingreso Total
            </p>
            <span className="text-sm text-gray-500">💳</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            $42,400
          </p>
          <p className="mt-2 text-xs text-emerald-400">
            +10% <span className="text-gray-500">vs. día anterior</span>
          </p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
              Egreso Total
            </p>
            <span className="text-sm text-gray-500">💸</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            $2,400
          </p>
          <p className="mt-2 text-xs text-red-400">
            +6% <span className="text-gray-500">vs. día anterior</span>
          </p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
              Miembros Totales
            </p>
            <span className="text-sm text-gray-500">👥</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            1,400
          </p>
          <p className="mt-2 text-xs text-emerald-400">
            +4% <span className="text-gray-500">alta mensual</span>
          </p>
        </Card>

        <Card className="bg-surface border border-gray-800 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
              Check‑ins Hoy
            </p>
            <span className="text-sm text-gray-500">📍</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            1,400
          </p>
          <p className="mt-2 text-xs text-red-400">
            -10% <span className="text-gray-500">vs. día anterior</span>
          </p>
        </Card>
      </div>

      {/* SECCIÓN INFERIOR: META + GRÁFICO / TABLA */}
      <div className="grid grid-cols-1 gap-4 xl:gap-6 lg:grid-cols-2">
        {/* Membership Target */}
        <Card className="bg-surface border border-gray-800 p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
                Meta de Membresía
              </p>
              <p className="text-sm text-gray-400">Seguimiento de objetivos por plan</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg bg-black/40 border border-gray-800 px-3 py-1 text-xs text-gray-300 hover:border-primary/60">
              Gold
              <span className="text-gray-500">▼</span>
            </button>
          </div>

          {/* Gauge / Donut fake chart */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex justify-center sm:justify-start">
              <div className="relative h-40 w-40 sm:h-44 sm:w-44 rounded-full bg-gradient-to-tr from-primary via-orange-500 to-pink-500 flex items-center justify-center">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-surface flex flex-col items-center justify-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-heading">
                    Progreso
                  </p>
                  <p className="text-2xl font-heading font-bold text-foreground">75.5%</p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    +10% hoy
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 text-xs sm:text-sm">
              <p className="text-gray-400">
                Es <span className="font-semibold text-foreground">más alto</span> que el día de ayer.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-heading">
                    Objetivo
                  </p>
                  <p className="text-foreground font-heading font-semibold">200 miembros</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-heading">
                    Actual
                  </p>
                  <p className="text-primary font-heading font-semibold">250 miembros</p>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-3 mt-1 space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-heading">
                  Distribución por plan
                </p>
                <div className="flex flex-wrap gap-2">
                  <LegendDot colorClass="bg-yellow-400" label="Gold" value="1,240" />
                  <LegendDot colorClass="bg-slate-300" label="Silver" value="620" />
                  <LegendDot colorClass="bg-amber-500" label="Bronze" value="320" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Membership Status Report (fake chart + table) */}
        <Card className="bg-surface border border-gray-800 p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold">
                Estado de Membresías
              </p>
              <p className="text-sm text-gray-400">
                Tendencia mensual por tipo de membresía.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <LegendPill colorClass="bg-yellow-400" label="Gold" />
              <LegendPill colorClass="bg-slate-300" label="Silver" />
              <LegendPill colorClass="bg-emerald-400" label="Platinum" />
            </div>
          </div>

          {/* Fake line chart area */}
          <div className="rounded-xl border border-gray-800 bg-gradient-to-b from-surface-light/50 to-black/40 h-44 sm:h-52 flex items-center justify-center text-xs text-gray-600">
            <span className="text-gray-500">
              Aquí irá un gráfico de líneas (ej. Recharts / Chart.js).
            </span>
          </div>

          {/* Tabla resumida con scroll horizontal en mobile */}
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-[600px] w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-800">
                  <th className="py-2 pr-4 font-normal">Miembro</th>
                  <th className="py-2 pr-4 font-normal">Plan</th>
                  <th className="py-2 pr-4 font-normal">Check‑ins</th>
                  <th className="py-2 pr-4 font-normal">Tiempo Activo</th>
                  <th className="py-2 pr-4 font-normal">Estado</th>
                  <th className="py-2 font-normal text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {MOCK_ROWS.map((row) => (
                  <tr key={row.id} className="hover:bg-black/30 transition-colors">
                    <td className="py-2 pr-4 text-gray-200">{row.name}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5 text-[11px]">
                        {row.plan}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-300">{row.checkins}</td>
                    <td className="py-2 pr-4 text-gray-300">{row.time}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          row.status === "Activo"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <button className="text-xs text-primary hover:underline">
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

const LegendDot = ({ colorClass, label, value }) => (
  <div className="flex items-center gap-2 text-xs text-gray-300">
    <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
    <span>{label}</span>
    {value && <span className="text-gray-500">· {value}</span>}
  </div>
);

const LegendPill = ({ colorClass, label }) => (
  <div className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-gray-800 px-2 py-0.5">
    <span className={`h-2 w-2 rounded-full ${colorClass}`} />
    <span className="text-gray-300">{label}</span>
  </div>
);

const MOCK_ROWS = [
  {
    id: 1,
    name: "Juan Pérez",
    plan: "Gold",
    checkins: "18 / mes",
    time: "12 h",
    status: "Activo",
  },
  {
    id: 2,
    name: "María López",
    plan: "Silver",
    checkins: "10 / mes",
    time: "7 h",
    status: "Activo",
  },
  {
    id: 3,
    name: "Carlos Díaz",
    plan: "Bronze",
    checkins: "4 / mes",
    time: "3 h",
    status: "Inactivo",
  },
  {
    id: 4,
    name: "Ana Gómez",
    plan: "Platinum",
    checkins: "22 / mes",
    time: "15 h",
    status: "Activo",
  },
];

export default Analytics;
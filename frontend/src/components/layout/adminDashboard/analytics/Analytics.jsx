import { Card } from "../../../ui/Card";

export const Analytics = () => {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
            Analytics 📊
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Datos y análisis del negocio en tiempo real.
          </p>
        </div>
  
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-surface border border-gray-800 p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
              Total Usuarios
            </p>
            <p className="text-3xl font-heading font-bold text-foreground">--</p>
            <p className="text-xs text-gray-400 mt-1">Cargando...</p>
          </Card>
  
          <Card className="bg-surface border border-gray-800 p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
              Usuarios Activos
            </p>
            <p className="text-3xl font-heading font-bold text-green-400">--</p>
            <p className="text-xs text-gray-400 mt-1">Cargando...</p>
          </Card>
  
          <Card className="bg-surface border border-gray-800 p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
              Ingresos Mensuales
            </p>
            <p className="text-3xl font-heading font-bold text-primary">$--</p>
            <p className="text-xs text-gray-400 mt-1">Cargando...</p>
          </Card>
  
          <Card className="bg-surface border border-gray-800 p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
              Nuevos (Este Mes)
            </p>
            <p className="text-3xl font-heading font-bold text-blue-400">--</p>
            <p className="text-xs text-gray-400 mt-1">Cargando...</p>
          </Card>
        </div>
  
        {/* Gráficos placeholder */}
        <Card className="bg-surface border border-gray-800 p-8 text-center">
          <h2 className="text-xl font-heading font-bold text-gray-400 mb-2">
            Gráficos
          </h2>
          <p className="text-gray-500">
            Aquí irán los gráficos de usuarios, ingresos y más.
          </p>
        </Card>
      </div>
    );
  };
  
  export default Analytics;
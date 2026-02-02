import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Navbar from '../components/layout/Navbar';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data - Eventually replace with API calls
  const membershipStatus = {
    active: true,
    plan: 'Premium Mensual',
    renewalDate: '15 de Marzo, 2026',
    daysLeft: 41,
  };

  const currentRoutine = {
    name: 'Fuerza Full Body',
    daysPerWeek: 4,
    focus: 'Fuerza y recomposición corporal',
    completedThisWeek: 2,
  };

  const goals = [
    'Perder 5kg en 3 meses',
    'Mejorar RM en sentadilla y peso muerto',
    'Entrenar 4 veces por semana de forma constante',
  ];

  const nutrition = {
    status: 'Plan básico asignado',
    calories: '2.200 kcal/día',
    protein: '150g proteína',
  };

  const nextClasses = [
    { name: 'Crossfit', time: 'Hoy a las 17:30', available: true },
    { name: 'Functional Training', time: 'Mañana a las 19:00', available: true },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        
        {/* Welcome Section */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
                Bienvenido, {user?.name || user?.email || 'Atleta'} 👋
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Tu panel de control en La Resistencia. Aquí ves tu membresía, rutina, objetivos y nutrición.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Key Info */}
        {membershipStatus.active && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {/* Days Left Card */}
            <Card className="bg-linear-to-br from-primary/20 to-primary/10 border border-primary/40">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Suscripción activa
                </h4>
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                {membershipStatus.daysLeft}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                días restantes
              </p>
            </Card>

            {/* Routine Progress */}
            <Card className="bg-surface border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Esta semana
                </h4>
              </div>
              <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                {currentRoutine.completedThisWeek}/{currentRoutine.daysPerWeek}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Entrenamientos completados
              </p>
            </Card>

            {/* Next Class */}
            <Card className="bg-surface border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Próxima clase
                </h4>
              </div>
              <p className="text-sm sm:text-base font-heading font-bold text-foreground">
                {nextClasses[0]?.name || 'No disponible'}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {nextClasses[0]?.time || 'Consulta el horario'}
              </p>
            </Card>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Membership Card */}
          <Card className="bg-surface border border-gray-800 lg:row-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Estado de tu membresía
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6">
              Información actual de tu acceso al gimnasio.
            </p>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between p-3 bg-surface-light rounded-lg border border-gray-700">
                <span className="text-xs sm:text-sm text-gray-400 font-medium">Estado</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    membershipStatus.active
                      ? 'bg-green-600/20 text-green-400 border border-green-500/40'
                      : 'bg-red-600/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {membershipStatus.active ? '✓ Activa' : 'Inactiva'}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 hover:bg-surface-light rounded transition-colors">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-semibold text-foreground">
                    {membershipStatus.plan}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-surface-light rounded transition-colors">
                  <span className="text-gray-400">Renovación</span>
                  <span className="font-semibold text-foreground">
                    {membershipStatus.renewalDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <Button className="w-full text-sm uppercase font-heading py-2">
                Ver detalles de membresía
              </Button>
              <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2">
                Cambiar plan
              </Button>
            </div>
          </Card>

          {/* Routine Card */}
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Rutina actual
              </h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6">
              Resumen de tu programa de entrenamiento asignado.
            </p>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between items-center p-2 hover:bg-surface-light rounded transition-colors">
                <span className="text-gray-400">Nombre</span>
                <span className="font-semibold text-foreground text-right max-w-xs">
                  {currentRoutine.name}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-surface-light rounded transition-colors">
                <span className="text-gray-400">Frecuencia</span>
                <span className="font-semibold text-foreground">
                  {currentRoutine.daysPerWeek}x/semana
                </span>
              </div>
              <div className="p-2 bg-surface-light rounded">
                <span className="text-gray-400 text-xs block mb-1">Enfoque</span>
                <p className="text-foreground text-sm font-medium">
                  {currentRoutine.focus}
                </p>
              </div>
            </div>

            <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2">
              Ver rutina completa
            </Button>
          </Card>

          {/* Goals Card */}
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Tus objetivos
              </h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6">
              Mantener claros tus objetivos es clave para no rendirte.
            </p>

            <ul className="space-y-3 text-sm mb-6 max-h-48 overflow-y-auto">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-3 p-2 hover:bg-surface-light rounded transition-colors">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="text-foreground">{goal}</span>
                </li>
              ))}
            </ul>

            <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2">
              Editar objetivos
            </Button>
          </Card>

          {/* Nutrition Card */}
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Tu nutrición
              </h3>
              <span className="text-2xl">🥗</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6">
              Lo que comés define tu rendimiento dentro y fuera del gimnasio.
            </p>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between items-center p-2 hover:bg-surface-light rounded transition-colors">
                <span className="text-gray-400">Estado</span>
                <span className="font-semibold text-foreground">
                  {nutrition.status}
                </span>
              </div>
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs font-medium">Calorías diarias</span>
                  <span className="font-bold text-foreground text-lg">
                    {nutrition.calories}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-surface-light rounded transition-colors">
                <span className="text-gray-400">Proteínas</span>
                <span className="font-semibold text-foreground">
                  {nutrition.protein}
                </span>
              </div>
            </div>

            <Button className="w-full text-sm uppercase font-heading py-2">
              Ver plan nutricional
            </Button>
          </Card>

          {/* Next Classes Card */}
          <Card className="bg-surface border border-gray-800 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Próximas clases disponibles
              </h3>
              <span className="text-2xl">📅</span>
            </div>

            {nextClasses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nextClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-700 rounded-lg hover:border-primary transition-colors hover:bg-surface-light"
                  >
                    <h4 className="font-semibold text-foreground mb-1">
                      {classItem.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-3">{classItem.time}</p>
                    <Button
                      variant="secondary"
                      className="w-full text-xs uppercase font-heading py-1.5"
                    >
                      Reservar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No hay clases disponibles en este momento.
              </p>
            )}
          </Card>
        </div>

        {/* Footer Action */}
        <div className="flex justify-center mt-12">
          <Button
            variant="secondary"
            className="text-sm uppercase font-heading px-6 py-2"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-surface mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
            <p>&copy; 2026 La Resistencia. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Soporte
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Términos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
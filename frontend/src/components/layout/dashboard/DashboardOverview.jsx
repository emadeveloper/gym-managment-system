import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import EmptyState from './EmptyState';
import MembershipProgressCard from './MembershipProgressCard';

import { Check, Dumbbell, Flame, CalendarDays, HandFist, Apple, Award, } from 'lucide-react';

const DashboardOverview = ({ user }) => {
  // Mock data - Eventually replace with API calls
  const membershipStatus = {
    active: true, // CAMBIAR A true/false PARA VER DIFERENTES ESTADOS
    plan: 'Premium Mensual',
    renewalDate: '15 de Marzo, 2026',
    daysLeft: 41,
  };

  // Simular diferentes estados de datos
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
    { name: 'HIIT Training', time: 'Hoy a las 17:30', available: true },
    { name: 'Strenght Training', time: 'Mañana a las 19:00', available: true },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Section */}
      <div className="mb-10 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 justify-center items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2 pb-4">
              Bienvenido {user?.name || 'a la Resistencia!'}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Tu panel de control en La Resistencia. Acá podés ver tu membresía, rutina, objetivos y nutrición.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats - Key Info - Solo si hay membresía activa */}
      {membershipStatus.active && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Entrenamientos esta semana */}
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Esta semana
              </h4>
              <Check className='text-primary' />
            </div>
            {currentRoutine ? (
              <>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  {currentRoutine.completedThisWeek}/{currentRoutine.daysPerWeek}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Entrenamientos completados
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-gray-500">
                  0/0
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Sin rutina asignada
                </p>
              </>
            )}
          </Card>

          {/* Próxima clase */}
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Próxima clase
              </h4>
              <CalendarDays className='text-primary'/>
            </div>
            {nextClasses.length > 0 ? (
              <>
                <p className="text-sm sm:text-base font-heading font-bold text-foreground">
                  {nextClasses[0]?.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {nextClasses[0]?.time}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm sm:text-base font-heading font-bold text-gray-500">
                  No disponible
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Sin clases disponibles
                </p>
              </>
            )}
          </Card>

          {/* Calorías objetivo */}
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Calorías objetivo
              </h4>
              <Flame className='text-primary'/>
            </div>
            {nutrition ? (
              <>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  {nutrition.calories.split(' ')[0]}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  kcal/día
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-gray-500">
                  --
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Sin plan nutricional
                </p>
              </>
            )}
          </Card>
        </div>
      )}

      {/* SIN MEMBRESÍA ACTIVA - Alert card */}
      {!membershipStatus.active && (
        <Card className="border border-yellow-600/40">
          <div className="flex items-start gap-4">
            <span className="text-4xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-heading font-bold text-yellow-400 mb-2 pb-2 border-b border-yellow-400/40">
                Activa tu membresía
              </h3>
              <p className="text-sm text-gray-300 mb-2 pb-2">
                Parece que aún no tienes una membresía activa. Elige un plan para acceder a todas nuestras funcionalidades, rutinas personalizadas y clases.
              </p>
              <Button className="text-sm uppercase font-heading py-2">
                Ver planes disponibles
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        {/* Membership Progress Card - NUEVO */}
        <MembershipProgressCard membershipStatus={membershipStatus} />

        {/* Routine Card */}
        {currentRoutine ? (
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Rutina actual
              </h3>
              <Dumbbell className='text-primary'/>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6 pb-3">
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
              <div className="flex justify-between p-2 bg-surface-light rounded">
                <span className="text-gray-400 text-xs block mb-1">Enfoque</span>
                <p className="text-foreground text-sm font-medium">
                  {currentRoutine.focus}
                </p>
              </div>
            </div>

            <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2 mt-16">
              Ver rutina completa
            </Button>
          </Card>
        ) : (
          <EmptyState
            icon="📭"
            title="Sin rutina asignada"
            description="Aún no tienes una rutina de entrenamiento. Contacta con nuestros entrenadores para que te asignen una personalizada."
            actionText="Solicitar rutina"
            actionCallback={() => console.log('Solicitar rutina')}
          />
        )}

        {/* Goals Card */}
        {goals.length > 0 ? (
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Tus objetivos
              </h3>
              <Award className='text-primary'/>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6 pb-3">
              Mantener claros tus objetivos es clave para no rendirte.
            </p>

            <ul className="space-y-3 text-sm mb-6 max-h-48 overflow-y-auto">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-3 p-2 hover:bg-surface-light rounded transition-colors">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-foreground">{goal}</span>
                </li>
              ))}
            </ul>

            <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2 mt-10">
              Editar objetivos
            </Button>
          </Card>
        ) : (
          <EmptyState
            icon="🎯"
            title="Sin objetivos definidos"
            description="Crea tus objetivos de entrenamiento para mantener la motivación y el enfoque en tu transformación."
            actionText="Definir objetivos"
            actionCallback={() => console.log('Definir objetivos')}
          />
        )}

        {/* Nutrition Card */}
        {nutrition ? (
          <Card className="bg-surface border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Tu nutrición
              </h3>
              <Apple className='text-primary'/>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-6 pb-3">
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
        ) : (
          <EmptyState
            icon="🥗"
            title="Sin plan nutricional"
            description="Un nutricionista personalizado puede crear un plan adaptado a tus objetivos y necesidades."
            actionText="Solicitar plan nutricional"
            actionCallback={() => console.log('Solicitar plan nutricional')}
          />
        )}

        {/* Next Classes Card */}
        {nextClasses.length > 0 ? (
          <Card className="bg-surface border border-gray-800 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                Próximas clases disponibles
              </h3>
              <CalendarDays className='text-primary'/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nextClasses.map((classItem, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-700 rounded-lg hover:border-primary transition-colors hover:bg-surface-light"
                >
                  <h4 className="font-semibold text-foreground mb-1 pb-2">
                    {classItem.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-3 pb-3">{classItem.time}</p>
                  <Button
                    variant="secondary"
                    className="w-full text-xs uppercase font-heading py-1.5"
                  >
                    Reservar
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <EmptyState
            icon="📅"
            title="Sin clases disponibles"
            description="No hay clases disponibles en este momento. Consulta el horario más tarde."
            className="lg:col-span-2"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import EmptyState from './EmptyState';
import {
  Apple,
  Award,
  CalendarDays,
  Dumbbell,
  Flame,
  HeartPulse,
  Target,
} from 'lucide-react';

const cardShell = 'rounded-[2rem] border border-gray-700 bg-surface-light p-5 sm:p-6';
const cardButton = 'mt-5 min-h-11 w-full text-sm uppercase font-heading';

function PassportCard({ icon, title, subtitle, children, actionText, onAction }) {
  const iconElement = icon
    ? React.createElement(icon, { className: 'h-6 w-6', 'aria-hidden': 'true' })
    : null;

  return (
    <section className={cardShell}>
      <div className="pt-1 text-center">
        <h3 className="text-3xl font-heading font-bold text-foreground sm:text-4xl">{title}</h3>
        <p className="mt-3 text-sm uppercase tracking-[0.12em] text-gray-400">{subtitle}</p>
      </div>

      <div className="mt-5 text-center">{children}</div>

      {actionText ? (
        <Button className={cardButton} onClick={onAction}>
          {actionText}
        </Button>
      ) : null}

      {iconElement ? (
        <div className="mt-4 flex justify-center text-primary">
          {iconElement}
        </div>
      ) : null}
    </section>
  );
}

const DashboardOverview = ({ user, dashboardData = {} }) => {
  const navigate = useNavigate();

  const defaultDashboardData = {
    membershipStatus: {
      active: true,
      plan: 'Premium Mensual',
      renewalDate: '15 de Marzo, 2026',
      daysLeft: 41,
      monthsActive: 6,
    },
    currentRoutine: {
      name: 'Fuerza Full Body',
      daysPerWeek: 4,
      focus: 'Fuerza y recomposición corporal',
      completedThisWeek: 2,
      todayWorkout: 'piernas',
    },
    goals: [
      'Perder 5kg en 3 meses',
      'Mejorar RM en sentadilla y peso muerto',
      'Entrenar 4 veces por semana de forma constante',
    ],
    nutrition: {
      status: 'Plan básico asignado',
      calories: '2.200 kcal/día',
      protein: '150g proteína',
    },
    nextClasses: [
      { name: 'HIIT Training', time: 'Hoy a las 17:30', available: true },
      { name: 'Strength Training', time: 'Mañana a las 19:00', available: true },
    ],
  };

  const membershipStatus = {
    ...defaultDashboardData.membershipStatus,
    ...(dashboardData.membershipStatus || {}),
  };

  const currentRoutine =
    dashboardData.currentRoutine === null
      ? null
      : {
          ...defaultDashboardData.currentRoutine,
          ...(dashboardData.currentRoutine || {}),
        };

  const goals = Array.isArray(dashboardData.goals) ? dashboardData.goals : defaultDashboardData.goals;

  const nutrition =
    dashboardData.nutrition === null
      ? null
      : {
          ...defaultDashboardData.nutrition,
          ...(dashboardData.nutrition || {}),
        };

  const nextClasses = Array.isArray(dashboardData.nextClasses)
    ? dashboardData.nextClasses
    : defaultDashboardData.nextClasses;

  const dashboardUserName = user?.name || 'Atleta';
  const motivationalPhrase = currentRoutine
    ? `Hoy toca entrenar ${currentRoutine.todayWorkout}. Así que a prepararse y romperla.`
    : 'Cada progreso empieza con una decisión firme: volver a entrenar.';

  return (
    <div className="space-y-4 pt-2 sm:space-y-6 sm:pt-4">
      <header className="text-center">
        <h1 className="text-3xl font-heading pb-2 font-bold uppercase text-foreground sm:text-4xl">
          La Resistencia te saluda, {dashboardUserName}
        </h1>
        <p className="mt-3 text-xl font-heading font-bold uppercase leading-snug text-primary sm:text-2xl">
          {motivationalPhrase}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {currentRoutine ? (
          <PassportCard
            icon={Dumbbell}
            title="Rutina actual"
            subtitle={currentRoutine.name}
            actionText="Ver rutina completa"
            onAction={() => navigate('/home?tab=routines')}
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-gray-400">Enfoque</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{currentRoutine.focus}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-gray-400">Frecuencia</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{currentRoutine.daysPerWeek} días por semana</p>
              </div>
            </div>
          </PassportCard>
        ) : (
          <EmptyState
            icon={Dumbbell}
            title="Sin rutina asignada"
            description="Cuando el equipo te asigne una rutina, la vas a ver acá."
            actionText="Solicitar rutina"
            actionCallback={() => console.log('Solicitar rutina')}
          />
        )}

        {nutrition ? (
          <PassportCard
            icon={Apple}
            title="Mi nutrición"
            subtitle={nutrition.status}
            actionText="Ver plan nutricional"
            onAction={() => navigate('/home?tab=nutrition')}
          >
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-400">Calorías diarias</p>
              <p className="text-2xl font-heading font-bold text-foreground">{nutrition.calories}</p>
            </div>
          </PassportCard>
        ) : (
          <EmptyState
            icon={Apple}
            title="Sin plan nutricional"
            description="Solicitá tu plan para acompañar la rutina con datos reales."
            actionText="Solicitar plan"
            actionCallback={() => console.log('Solicitar plan nutricional')}
          />
        )}

        {goals.length > 0 ? (
          <PassportCard
            icon={Target}
            title="Objetivos"
            subtitle="Meta principal"
            actionText="Editar objetivos"
            onAction={() => navigate('/home?tab=profile')}
          >
            <div className="space-y-3">
              <p className="text-lg font-semibold text-foreground">{goals[0]}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-gray-400">{goals.length} objetivos activos</p>
            </div>
          </PassportCard>
        ) : (
          <EmptyState
            icon={Award}
            title="Sin objetivos definidos"
            description="Definí tus metas para medir avances reales cada semana."
            actionText="Definir objetivos"
            actionCallback={() => navigate('/home?tab=profile')}
          />
        )}

        <PassportCard
          icon={HeartPulse}
          title="Membresía"
          subtitle={membershipStatus.plan || 'Sin plan'}
          actionText="Gestionar membresía"
          onAction={() => navigate('/home?tab=profile')}
        >
          {membershipStatus.active ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-gray-400">Renovación</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{membershipStatus.renewalDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-gray-400">Días restantes</p>
                <p className="mt-1 text-2xl font-heading font-bold text-primary">{membershipStatus.daysLeft}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold text-yellow-400">Membresía inactiva</p>
              <p className="mt-2 text-sm text-gray-300">Reactivala para volver a rutinas, nutrición y clases.</p>
            </>
          )}
        </PassportCard>

        {nextClasses.length > 0 ? (
          <section className={`${cardShell} lg:col-span-2`}>
            <div className="pt-1 text-center">
              <h3 className="text-3xl font-heading font-bold text-foreground sm:text-4xl">Próximas clases</h3>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-gray-400">Reservá tu próximo bloque</p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {nextClasses.map((classItem, index) => (
                <article key={index} className="rounded-3xl border border-gray-700 bg-surface p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Flame className="h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-base font-heading font-bold text-foreground">{classItem.name}</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{classItem.time}</p>
                  <Button className={cardButton}>Reservar</Button>
                </article>
              ))}
            </div>

            <div className="mt-4 flex justify-center text-primary">
              <CalendarDays className="h-6 w-6" aria-hidden="true" />
            </div>
          </section>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="Sin clases disponibles"
            description="No hay clases cargadas por ahora. Revisá más tarde."
            className="lg:col-span-2"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;

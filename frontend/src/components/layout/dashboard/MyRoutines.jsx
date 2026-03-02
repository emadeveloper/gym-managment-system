import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Dumbbell } from 'lucide-react';
import { useGymData } from '../../../context/GymDataContext';

const MyRoutines = ({ user }) => {
    const { getAssignedRoutinesForUser } = useGymData();
    const routines = getAssignedRoutinesForUser(user?.email);
  
    return (
      <div className="space-y-2">
        <div className='flex items-center justify-center gap-4'>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
            Mis Rutinas
          </h1>
          <Dumbbell className='text-primary w-12 h-12'/>
        </div>
        <div>
          <p className="text-sm sm:text-base text-gray-400 text-center pb-3">
            Accede a todas tus rutinas personalizadas y realiza un seguimiento de tu progreso.
          </p>
        </div>
  
        {routines.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {routines.map((routine) => (
            <Card key={routine.id} className="bg-surface border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                    {routine.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {routine.focusArea || routine.goal}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    routine.status === 'Activa'
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : routine.status === 'Archivada'
                        ? 'bg-gray-700/20 text-gray-300 border border-gray-600/40'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  {routine.status}
                </span>
              </div>
  
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-700">
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{routine.sessionsPerWeek}</p>
                  <p className="text-xs text-gray-400">días/semana</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{routine.exercises || 0}</p>
                  <p className="text-xs text-gray-400">ejercicios</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{routine.duration}</p>
                  <p className="text-xs text-gray-400">duración</p>
                </div>
              </div>
  
              <div className="flex flex-col gap-2">
                <Button className="w-full text-sm uppercase font-heading py-2">
                  Ver detalles
                </Button>
                <Button variant="secondary" className="w-full text-sm uppercase font-heading py-2">
                  {routine.status === 'Activa' ? 'Comenzar entrenamiento' : 'Ver planificación'}
                </Button>
              </div>
            </Card>
          ))}
          </div>
        ) : (
          <Card className="bg-surface border border-gray-800 text-center">
            <h3 className="text-lg font-heading font-bold text-foreground mb-4 pb-1">
              Todavía no tienes una rutina asignada
            </h3>
            <p className="text-gray-400 mb-4 pb-2">
              Cuando el equipo te asigne una rutina desde administración, aparecerá aquí
              automáticamente con su carga, duración y estado.
            </p>
            <Button className="w-full text-sm uppercase font-heading py-2">
              Solicitar revisión
            </Button>
          </Card>
        )}
  
        <Card className="bg-surface border border-gray-800 text-center">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4 pb-1">
            ¿Necesitas una rutina nueva?
          </h3>
          <p className="text-gray-400 mb-4 pb-2">
            Contacta con nuestro equipo de entrenadores para crear una rutina personalizada según tus objetivos.
          </p>
          <Button className="w-full text-sm uppercase font-heading py-2">
            Solicitar nueva rutina
          </Button>
        </Card>
      </div>
    );
  };
  
  export default MyRoutines;

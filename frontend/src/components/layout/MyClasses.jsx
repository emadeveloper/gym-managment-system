import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const MyClasses = ({ user }) => {

  const classes = [
    {
      id: 1,
      name: 'HIIT Training',
      instructor: 'Carlos López',
      day: 'Lunes',
      time: '17:30',
      duration: '45 min',
      spots: 8,
      capacity: 15,
      booked: false,
    },
    {
      id: 2,
      name: 'Strength Training',
      instructor: 'María García',
      day: 'Martes',
      time: '19:00',
      duration: '60 min',
      spots: 3,
      capacity: 12,
      booked: true,
    },
    {
      id: 3,
      name: 'Yoga y Flexibilidad',
      instructor: 'Juan Martínez',
      day: 'Miércoles',
      time: '18:00',
      duration: '50 min',
      spots: 12,
      capacity: 20,
      booked: false,
    },
    {
      id: 4,
      name: 'CrossFit',
      instructor: 'Ana Ruiz',
      day: 'Jueves',
      time: '17:45',
      duration: '55 min',
      spots: 2,
      capacity: 10,
      booked: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
          Clases Disponibles
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Reserva y participa en nuestras clases grupales. Aprende de nuestros entrenadores expertos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="bg-surface border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                  {classItem.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Por {classItem.instructor}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  classItem.booked
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-gray-700/20 text-gray-300 border border-gray-600/40'
                }`}
              >
                {classItem.booked ? '✓ Reservada' : 'Disponible'}
              </span>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Día</span>
                <span className="font-semibold text-foreground">{classItem.day}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Hora</span>
                <span className="font-semibold text-foreground">{classItem.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duración</span>
                <span className="font-semibold text-foreground">{classItem.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Espacios disponibles</span>
                <span className={`font-semibold ${
                  classItem.spots > 5 ? 'text-green-400' : classItem.spots > 0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {classItem.spots}/{classItem.capacity}
                </span>
              </div>
            </div>

            <Button
              variant={classItem.booked ? 'secondary' : 'primary'}
              className="w-full text-sm uppercase font-heading py-2"
            >
              {classItem.booked ? 'Cancelar reserva' : 'Reservar clase'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
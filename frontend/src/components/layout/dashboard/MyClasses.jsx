import React, { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Users } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import EmptyState from './EmptyState';
import { useGymData } from '../../../context/GymDataContext';
import { useToast } from '../../../hooks/useToast';

const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function formatDateKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatReadableDate(dateValue) {
  const parsedDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const MyClasses = ({ user }) => {
  const { classes, enrollInClass } = useGymData();
  const toast = useToast();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState('');

  const todayKey = useMemo(() => {
    const today = new Date();
    return formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);
  const normalizedUserEmail = user?.email?.toLowerCase() || '';

  const isUserEnrolled = (classItem) =>
    classItem.enrollments.some(
      (enrollment) => enrollment.memberEmail.toLowerCase() === normalizedUserEmail,
    );

  const classesByDate = useMemo(() => {
    const map = new Map();

    classes.forEach((classItem) => {
      const currentList = map.get(classItem.date) || [];
      map.set(classItem.date, [...currentList, classItem]);
    });

    return map;
  }, [classes]);

  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthStart = new Date(year, month, 1);
    const monthDays = new Date(year, month + 1, 0).getDate();
    const startOffset = monthStart.getDay();

    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - startOffset + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= monthDays;

      if (!isCurrentMonth) {
        return {
          key: `blank-${index}`,
          isCurrentMonth: false,
          dayNumber: null,
          dateKey: '',
          dayClasses: [],
        };
      }

      const dateKey = formatDateKey(year, month, dayNumber);
      return {
        key: dateKey,
        isCurrentMonth: true,
        dayNumber,
        dateKey,
        dayClasses: classesByDate.get(dateKey) || [],
      };
    });
  }, [classesByDate, currentMonth]);

  const selectedClasses = useMemo(
    () => classesByDate.get(selectedDateKey) || [],
    [classesByDate, selectedDateKey],
  );

  const selectedClass = useMemo(
    () => selectedClasses.find((classItem) => classItem.id === selectedClassId) || null,
    [selectedClassId, selectedClasses],
  );

  const subscribedClasses = useMemo(
    () =>
      [...classes]
        .filter((classItem) =>
          classItem.enrollments.some(
            (enrollment) => enrollment.memberEmail.toLowerCase() === normalizedUserEmail,
          ),
        )
        .sort((first, second) => `${first.date}T${first.startTime}`.localeCompare(`${second.date}T${second.startTime}`)),
    [classes, normalizedUserEmail],
  );

  const openDateModal = (dateKey, dayClasses) => {
    if (!dayClasses.length) {
      return;
    }

    setSelectedDateKey(dateKey);
    setSelectedClassId(dayClasses[0].id);
    setComment('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDateKey('');
    setSelectedClassId('');
    setComment('');
  };

  const handleMonthChange = (delta) => {
    setCurrentMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const handleSubmitEnrollment = async (event) => {
    event.preventDefault();

    if (!selectedClassId) {
      toast.error('Seleccioná una clase para continuar.', 'Falta seleccionar clase');
      return;
    }

    setIsSubmitting(true);

    try {
      await enrollInClass({
        classId: selectedClassId,
        user,
        notes: comment,
      });

      toast.success('Te inscribiste correctamente a la clase.', 'Inscripción confirmada');
      closeModal();
    } catch (error) {
      toast.error(error.message || 'No se pudo completar la inscripción.', 'Error de inscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <div className="inline-flex items-center justify-center gap-3">
          <h1 className="text-3xl font-heading font-bold text-foreground sm:text-4xl lg:text-5xl">Calendario de clases</h1>
          <CalendarDays className="h-9 w-9 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm text-gray-400 sm:text-base">
          Tocá una fecha marcada para ver la clase del día e inscribirte.
        </p>
      </section>

      <Card className="border border-gray-800 bg-surface p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button variant="secondary" className="min-h-11 px-3" onClick={() => handleMonthChange(-1)}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>

          <h2 className="text-center text-lg font-heading font-bold uppercase tracking-[0.08em] text-foreground sm:text-xl">
            {currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
          </h2>

          <Button variant="secondary" className="min-h-11 px-3" onClick={() => handleMonthChange(1)}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {WEEK_DAYS.map((dayLabel) => (
            <div
              key={dayLabel}
              className="rounded-xl border border-gray-800 bg-surface-light py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
            >
              {dayLabel}
            </div>
          ))}

          {calendarCells.map((cell) => {
            if (!cell.isCurrentMonth) {
              return <div key={cell.key} className="min-h-20 rounded-xl border border-transparent" />;
            }

            const hasClasses = cell.dayClasses.length > 0;
            const hasSubscribedClass = cell.dayClasses.some((classItem) => isUserEnrolled(classItem));
            const isToday = cell.dateKey === todayKey;

            const dayCellClass = hasSubscribedClass
              ? 'cursor-pointer border-primary bg-primary text-white hover:bg-red-700'
              : hasClasses
                ? 'cursor-pointer border-primary/50 bg-primary/10 hover:bg-primary/15'
                : 'border-gray-800 bg-surface-light';

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => openDateModal(cell.dateKey, cell.dayClasses)}
                className={`min-h-24 rounded-xl border p-2 text-left transition-colors ${dayCellClass}`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? 'bg-white text-black'
                      : hasSubscribedClass
                        ? 'text-white'
                        : 'text-foreground'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {hasClasses ? (
                  <div className="mt-2 space-y-1">
                    {cell.dayClasses.slice(0, 2).map((classItem) => (
                      <p
                        key={classItem.id}
                        className={`truncate rounded-md px-2 py-1 text-[11px] font-semibold ${
                          hasSubscribedClass ? 'bg-white/15 text-white' : 'bg-black/30 text-primary'
                        }`}
                      >
                        {classItem.title}
                      </p>
                    ))}
                    {cell.dayClasses.length > 2 ? (
                      <p className={`text-[10px] uppercase tracking-[0.08em] ${hasSubscribedClass ? 'text-white/80' : 'text-gray-400'}`}>
                        +{cell.dayClasses.length - 2} más
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="text-2xl font-heading font-bold text-foreground sm:text-3xl pb-4 text-center">
          Clases a las que estás suscripto
        </h2>

        {subscribedClasses.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Aún no te suscribiste a ninguna clase"
            description="Explorá el calendario y tocá una fecha con clase para completar tu primera inscripción."
            className="border border-gray-800 bg-surface"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {subscribedClasses.map((classItem) => {
              const enrolledCount = classItem.enrollments.length;
              const availableSpots = Math.max(0, classItem.capacity - enrolledCount);

              return (
                <Card key={classItem.id} className="border border-gray-800 bg-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-heading font-bold text-foreground pb-4">{classItem.title}</h3>
                    <span className="rounded-full border border-primary bg-surface px-2 py-1 text-xs uppercase tracking-widest text-primary">
                      {classItem.classType}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">{classItem.description}</p>

                  <div className="mt-4 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
                    <p className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                      {formatReadableDate(classItem.date)}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                      {classItem.startTime} - {classItem.endTime}
                    </p>
                    <p className="inline-flex items-center gap-2 sm:col-span-2">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                      {enrolledCount} inscriptos · {availableSpots} cupos libres
                    </p>
                  </div>

                  <Button
                    className="mt-4 min-h-11 w-full text-sm uppercase font-heading"
                    variant="secondary"
                    onClick={() => openDateModal(classItem.date, [classItem])}
                  >
                    Ver detalle de mi clase
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-700 bg-surface p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-gray-700 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Inscripción</p>
                <h3 className="mt-1 text-2xl font-heading font-bold text-foreground">{formatReadableDate(selectedDateKey)}</h3>
              </div>
              <Button variant="secondary" className="min-h-11" onClick={closeModal}>
                Cerrar
              </Button>
            </div>

            <form onSubmit={handleSubmitEnrollment} className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Clase del día</p>
                <div className="grid gap-2">
                  {selectedClasses.map((classItem) => {
                    const enrolledCount = classItem.enrollments.length;
                    const availableSpots = Math.max(0, classItem.capacity - enrolledCount);
                    const selected = selectedClassId === classItem.id;

                    return (
                      <button
                        key={classItem.id}
                        type="button"
                        onClick={() => setSelectedClassId(classItem.id)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                          selected
                            ? 'border-primary/40 bg-primary/10'
                            : 'border-gray-700 bg-surface-light hover:border-primary/30'
                        }`}
                      >
                        <p className="text-sm font-semibold text-foreground">{classItem.title}</p>
                        <p className="mt-1 text-xs text-gray-400">{classItem.description}</p>
                        <p className="mt-2 text-xs text-gray-300">
                          Horario: {classItem.startTime} - {classItem.endTime}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">Cupos libres: {availableSpots}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.14em] text-gray-500">Comentario</span>
                <textarea
                  name="notes"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={3}
                  placeholder="Opcional: contale algo al coach"
                  className="w-full rounded-2xl border border-gray-700 bg-surface-light px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40"
                />
              </label>

              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!selectedClass || isUserEnrolled(selectedClass)}
                className="min-h-11 w-full text-sm uppercase font-heading"
              >
                {selectedClass && isUserEnrolled(selectedClass) ? 'Ya estás inscripto' : 'Inscribirme a esta clase'}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyClasses;

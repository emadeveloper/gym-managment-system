import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const testimonialsData = [
  {
    id: 1,
    name: 'Juan Pérez',
    plan: 'Plan Élite · 6 meses',
    story: 'Entré buscando bajar grasa y terminé construyendo una rutina que hoy sostengo sin negociar.',
    metrics: '15 kg menos y 50% más de fuerza',
    initials: 'JP',
    focus: 'Recomposición corporal',
  },
  {
    id: 2,
    name: 'Sara López',
    plan: 'Fuerza · 12 meses',
    story: 'La diferencia no fue solo física: por primera vez tuve una estructura clara para entrenar con intención.',
    metrics: '+8 kg de masa muscular y nuevo PR en sentadilla',
    initials: 'SL',
    focus: 'Fuerza y técnica',
  },
  {
    id: 3,
    name: 'Pedro Gómez',
    plan: 'HIIT · 3 meses',
    story: 'Necesitaba volver a moverme en serio. El equipo me dio exigencia, seguimiento y un plan concreto.',
    metrics: '20% menos de grasa corporal',
    initials: 'PG',
    focus: 'Acondicionamiento',
  },
  {
    id: 4,
    name: 'Julián Martínez',
    plan: 'Hipertrofia · 18 meses',
    story: 'Dejé de cambiar de rutina cada semana. Con orden y constancia, los resultados por fin empezaron a acumularse.',
    metrics: '+6 kg de masa magra',
    initials: 'JM',
    focus: 'Hipertrofia',
  },
];

const Testimonials = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      id="community"
      ref={sectionRef}
      className={`bg-background py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto">

        <div
          className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 pb-4 sm:mb-8 uppercase tracking-wide">
            Historias que aguantan el tiempo
          </h2>

          <div className="flex justify-center">
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl">
              Sin fotos de stock ni promesas vacías: disciplina, acompañamiento y cambios que se notan en el día a día.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-surface border border-gray-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group hover:border-primary hover:shadow-lg hover:shadow-primary/20 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${400 + index * 150}ms` : '0ms',
              }}
            >

              <div className="border-b border-gray-800 bg-[linear-gradient(135deg,rgba(204,0,0,0.14),rgba(255,255,255,0.02))] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-black/30 font-heading text-xl font-bold uppercase text-primary">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Objetivo</p>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white">
                        {testimonial.focus}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Caso real
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary uppercase tracking-wide mb-2">
                  {testimonial.name}
                </h3>

                <p className="text-sm sm:text-base text-gray-400 font-body mb-6">
                  {testimonial.plan}
                </p>

                <blockquote className="text-gray-300 italic leading-relaxed mb-8 flex-1">
                  "{testimonial.story}"
                </blockquote>

                <div className="border-t border-gray-700 pt-4 sm:pt-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Resultado observado</p>
                  <p className="mt-2 text-sm font-body font-bold text-primary/80">
                    {testimonial.metrics}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;

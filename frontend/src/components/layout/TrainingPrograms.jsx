import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const TrainingPrograms = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  const programs = [
    {
      id: 1,
      title: 'Entrenamiento de Fuerza',
      description: 'Desarrolla músculo, aumenta tu fuerza y mejora la densidad ósea',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Cardio',
      description: 'Mejora tu salud cardiovascular, quema calorías y aumenta tu resistencia',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Pérdida de Peso',
      description: 'Combinando entrenamiento de fuerza, cardio y guía nutricional personalizada',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Flexibilidad y Movilidad',
      description: 'Mejora tu rango de movimiento, reduce lesiones y aumenta tu bienestar general',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Entrenamiento Funcional',
      description: 'Movimientos que mejoran tu vida diaria y rendimiento deportivo',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'HIIT',
      description: 'Entrenamiento de alta intensidad para resultados rápidos y eficientes',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section 
      id="programs" 
      ref={sectionRef}
      className={`border-y border-gray-900 bg-background py-24 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Disciplinas de la casa
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white uppercase tracking-tight">
            Programas que se sostienen
          </h2>
          <div className="flex justify-center">
            <p className="mt-6 max-w-3xl text-lg md:text-xl text-gray-400">
              Cada bloque combina estructura, progresión y seguimiento para que tu esfuerzo
              tenga dirección, no solo intensidad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className={`group rounded-3xl border border-gray-800 bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${400 + index * 100}ms` : '0ms'
              }}
            >
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl border border-gray-800 bg-black/30 p-4 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <div>
                    {program.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-heading font-bold text-white mb-4 text-center uppercase">
                {program.title}
              </h3>

              <p className="text-gray-400 text-center leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-lg">
            Diseñados por entrenadores certificados y ajustados a tu nivel, para que el
            progreso no dependa de improvisar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrainingPrograms;

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
      className={`bg-gray-100 py-40 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 uppercase tracking-wide pb-3">
            Nuestros Programas de Entrenamiento
          </h2>
          <div className='flex justify-center'>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mt-6">
              Descubrí nuestros programas especializados diseñados para ayudarte a alcanzar tus objetivos.
            </p>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className={`bg-[#202128] rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:scale-105 group ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${400 + index * 100}ms` : '0ms'
              }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 rounded-full p-4 group-hover:bg-primary/80 transition-colors">
                  <div className="text-white">
                    {program.icon}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                {program.title}
              </h3>

              {/* Description */}
              <p className="text-white/90 text-center leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg">
            Todos nuestros programas están diseñados por entrenadores certificados y se adaptan a tu nivel de condición física
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrainingPrograms;


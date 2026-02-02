import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

// Sample data structure for the testimonials
const testimonialsData = [
  {
    id: 1,
    name: 'JUAN PÉREZ',
    plan: 'Plan Élite - 6 Meses',
    story: 'Gracias a Heavy Duty Gym, no solo perdí 15kg, sino que tripliqué mi energía. Las rutinas son intensas pero el resultado es innegable.',
    metrics: 'Pérdida de 15kg y 50% más de fuerza',
    imageSrc: 'path/to/juan_after.jpg',
  },
  {
    id: 2,
    name: 'SARA LÓPEZ',
    plan: 'Entrenamiento de Fuerza - 12 Meses',
    story: 'Mi transformación ha sido mental y física. La guía nutricional y el ambiente me motivaron a ser constante. ¡Ahora amo el gimnasio!',
    metrics: 'Masa muscular +8kg, récord personal en Sentadilla',
    imageSrc: 'path/to/sara_after.jpg',
  },
  {
    id: 3,
    name: 'PEDRO GÓMEZ',
    plan: 'Programa HIIT - 3 Meses',
    story: 'Necesitaba resultados rápidos y eficientes. El programa HIIT de Heavy Duty fue brutal, pero conseguí la definición que buscaba a tiempo.',
    metrics: '20% reducción de grasa corporal',
    imageSrc: 'path/to/pedro_after.jpg',
  },
  {
    id: 4,
    name: 'JULIÁN MARTÍNEZ',
    plan: 'Programa Hipertrofia - 18 Meses',
    story: 'Quería aumentar mi masa muscular y mi fuerza al mismo tiempo, este plan me ayudó a mejorar ambas cosas en poquísimo tiempo.',
    metrics: '20% reducción de grasa corporal',
    imageSrc: 'path/to/pedro_after.jpg',
  },
];

const Testimonials = () => {
  // Apply scroll reveal to the whole section
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

        {/* HEADER SECTION */}
        <div
          className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 pb-4 sm:mb-8 uppercase tracking-wide">
            Testimonios Reales. Resultados Heavy Duty.
          </h2>

          <div className="flex justify-center">
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl">
              Nuestros clientes hablan por nosotros. Mirá las transformaciones que logramos juntos.
            </p>
          </div>
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
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

              {/* IMAGE SECTION */}
              <div className="w-full h-64 sm:h-72 overflow-hidden bg-surface-light">
                <img
                  src={testimonial.imageSrc}
                  alt={`Transformación de ${testimonial.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* CONTENT SECTION */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">

                {/* NAME */}
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary uppercase tracking-wide mb-2 pb-6">
                  {testimonial.name}
                </h3>

                {/* PLAN */}
                <p className="text-sm sm:text-base text-gray-400 font-body mb-6">
                  {testimonial.plan}
                </p>

                {/* STORY/QUOTE */}
                <blockquote className="text-gray-400 italic leading-relaxed mb-8 flex-1">
                  "{testimonial.story}"
                </blockquote>

                {/* METRICS */}
                <div className="border-t border-gray-700 pt-4 sm:pt-6">
                  <p className="text-xs sm:text-sm font-body font-bold text-primary/80">
                    ✓ {testimonial.metrics}
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
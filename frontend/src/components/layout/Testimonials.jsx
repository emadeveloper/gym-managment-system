

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
    imageSrc: 'path/to/juan_after.jpg', // Placeholder image URL
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
      id="testimonios" 
      ref={sectionRef}
      // Used primary-bg for a dark section background
      className={`bg-primary-bg py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Uses Oswald for impact */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Headline uses text-foreground and Oswald (via h2 style) */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 uppercase tracking-wide">
            Testimonios Reales. Resultados Heavy Duty.
          </h2>
          {/* Paragraph uses secondary text color and Inter (default style) */}
          <p className="text-lg md:text-xl text-secondary-text max-w-3xl mx-auto mt-6">
            Nuestros clientes hablan por nosotros. Mirá las transformaciones que logramos juntos.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={testimonial.id}
              // Use bg-surface for the card background color
              className={` justify-center bg-surface rounded-2xl p-lg shadow-2xl flex flex-col transition-all duration-300 group ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                // Staggered delay for each card
                transitionDelay: isVisible ? `${400 + index * 150}ms` : '0ms',
                // Add a hover effect to emphasize the card
                transform: isVisible ? 'none' : 'translateY(10px)',
              }}
            >
              
              {/* 1. Image (Visual Proof) */}
              <div className="w-full h-64 overflow-hidden rounded-lg mb-base border border-mid-gray/50">
                  <img 
                      src={testimonial.imageSrc} 
                      alt={`Transformación de ${testimonial.name}`} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                  />
              </div>

              {/* 2. Name & Plan */}
              <h3 className="text-2xl flex justify-center font-heading uppercase text-gym-red mb-xs mt-3">
                {testimonial.name}
              </h3>
              <p className="text-md text-foreground font-sans mb-base flex justify-center mt-2">
                {testimonial.plan}
              </p>

              {/* 3. The Story/Quote (Inter font, readable text color) */}
              <div className='w-full flex justify-center px-4 mt-2'>
                <blockquote className="text-secondary-text italic grow mb-md leading-relaxed">
                    "{testimonial.story}"
                </blockquote>
              </div>

              {/* 4. The Metrics (Muted, subtle separation) */}
              <div className="w-full border-t border-mid-gray pt-sm mt-2">
                <p className="text-text-muted text-sm font-sans p-2 font-bold">
                  {testimonial.metrics}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
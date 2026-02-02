import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Plans = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  const plans = [
    {
      id: 1,
      name: 'Básico',
      price: '$14.999',
      period: '/mes',
      description: 'Perfecto para comenzar tu transformación',
      features: [
        'Acceso a todas las instalaciones',
        'Rutinas básicas personalizadas',
        'Asesoramiento nutricional básico',
        'Acceso a clases grupales',
        'App móvil incluida',
      ],
      popular: false,
      buttonText: 'Comenzar',
      buttonVariant: 'secondary',
    },
    {
      id: 2,
      name: 'Premium',
      price: '$29.999',
      period: '/mes',
      description: 'El plan más popular para resultados óptimos',
      features: [
        'Todo lo del plan Básico',
        'Entrenador personal 2x por semana',
        'Plan nutricional personalizado',
        'Acceso ilimitado a clases premium',
        'Análisis de composición corporal',
        'Seguimiento de progreso avanzado',
        'Soporte prioritario 24/7',
      ],
      popular: true,
      buttonText: 'Elegir Premium',
      buttonVariant: 'primary',
    },
    {
      id: 3,
      name: 'VIP',
      price: '$49.999',
      period: '/mes',
      description: 'Experiencia exclusiva y completa',
      features: [
        'Todo lo del plan Premium',
        'Entrenador personal ilimitado',
        'Nutricionista personal dedicado',
        'Acceso a zona VIP exclusiva',
        'Masajes y recuperación incluidos',
        'Programa de suplementación',
        'Consultas ilimitadas',
        'Eventos exclusivos VIP',
      ],
      popular: false,
      buttonText: 'Elegir VIP',
      buttonVariant: 'secondary',
    },
  ];

  return (
    <section
      id="plans"
      ref={sectionRef}
      className={`bg-[#202128] py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
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
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-4 sm:mb-6 uppercase tracking-wide">
            Elegí tu plan
          </h2>

          {/* Subtitle */}
          <div className="flex justify-center">
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-4xl pt-4">
              Encontrá el plan perfecto que se adapte a tus objetivos y estilo de vida.
              Todos nuestros planes incluyen acceso completo a nuestras instalaciones y equipamiento de última generación.
            </p>
          </div>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-8 lg:gap-10 items-start mb-16 sm:mb-20 lg:mb-24">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative transition-all duration-700 ${
                plan.popular ? 'md:scale-105 md:-mt-8' : ''
              } ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${300 + index * 100}ms` : '0ms',
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-primary text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-heading font-bold uppercase tracking-wider shadow-lg shadow-primary/50">
                    ★ Más Popular
                  </span>
                </div>
              )}

              {/* CARD */}
              <div
                className={`h-full rounded-2xl shadow-xl transition-all duration-300 flex flex-col ${
                  plan.popular
                    ? 'bg-surface border border-primary hover:shadow-2xl hover:shadow-primary/30'
                    : 'bg-surface border hover:shadow-xl'
                } p-6 sm:p-8 lg:p-10`}
              >
                {/* Plan Name */}
                <div className="text-center mb-6 sm:mb-8">
                  <h3
                    className={`text-2xl sm:text-3xl font-heading font-bold mb-2 sm:mb-3 ${
                      plan.popular ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="text-center mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-gray-700/50">
                  <div className="flex items-baseline justify-center gap-2">
                    <span
                      className={`text-5xl sm:text-6xl font-heading font-bold ${
                        plan.popular ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-sm sm:text-base">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="flex-1 space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 ${
                          plan.popular ? 'text-primary' : 'text-secondary'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto py-6">
                  <Link to="/register" className="block w-full">
                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className={`w-full py-3 sm:py-4 text-sm sm:text-base font-heading font-bold uppercase tracking-wide transition-all duration-300 ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/40'
                          : 'hover:bg-primary hover:text-white'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER INFO */}
        <div className="text-center pt-2 sm:pt-10 border-t border-gray-800">
          <p className="text-xs sm:text-sm text-gray-400">
            Todos los planes incluyen cancelación sin cargo con 30 días de anticipación.
            <Link
              to="#terminos"
              className="text-primary hover:text-secondary ml-1 sm:ml-2 underline transition-colors duration-200"
            >
              Ver términos y condiciones
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
};

export default Plans;
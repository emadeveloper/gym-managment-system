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
      className={`bg-[#202128] py-40 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-24 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Elegí tu plan
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Encontrá el plan perfecto que se adapte a tus objetivos y estilo de vida. 
            Todos nuestros planes incluyen acceso completo a nuestras instalaciones y equipamiento de última generación.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative transition-all duration-700 ${
                plan.popular
                  ? 'md:scale-105 md:-mt-4 md:mb-4 z-10'
                  : ''
              } ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${300 + index * 100}ms` : '0ms'
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                    Más Popular
                  </span>
                </div>
              )}

              {/* Card */}
              <div
                className={`h-full rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-primary/20 ${
                  plan.popular
                    ? 'bg-linear-to-br from-primary/20 via-[#1a1a1a] to-black border-2 border-primary'
                    : 'bg-[#1a1a1a] border border-[#2a2a2a]'
                } p-8 flex flex-col`}
              >
                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      plan.popular ? 'text-primary' : 'text-white'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span
                      className={`text-5xl font-bold ${
                        plan.popular ? 'text-primary' : 'text-white'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-lg ml-2">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className={`w-6 h-6 mr-3 shrink-0 mt-0.5 ${
                          plan.popular ? 'text-primary' : 'text-secondary'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Link to="/register" className="block">
                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className={`w-full py-3 text-lg font-bold ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50'
                          : 'bg-[#2a2a2a] hover:bg-[#333333] text-black'
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

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            Todos los planes incluyen cancelación sin cargo con 30 días de anticipación. 
            <Link to="#terminos" className="text-primary hover:text-secondary ml-1 underline">
              Ver términos y condiciones
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Plans;


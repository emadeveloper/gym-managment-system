import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import HeroBanner from '../../docs/img/hero-banner-4.jpg';
import { useScrollToSection } from '../../hooks/useScrollToSection';

const HeroSection = () => {
  const { scrollTo } = useScrollToSection();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-gray-900 bg-background"
    >
      <div className="absolute inset-0">
        <img
          src={HeroBanner}
          alt="Entrenamiento en La Resistencia"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.72)_38%,rgba(0,0,0,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.68)_42%,rgba(0,0,0,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(204,0,0,0.16),transparent_32%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-10 md:min-h-[88vh] md:justify-start md:pt-28 md:pb-16 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
          <h1 className="text-3xl font-heading font-bold uppercase leading-none tracking-tight text-white sm:text-4xl md:text-6xl xl:text-7xl">
            No viniste a encajar.
            <span className="mt-2 block text-primary">
              Viniste a Resistir.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-300 sm:mt-5 sm:text-base sm:leading-7 md:mx-0 md:mt-6 md:max-w-2xl md:text-lg md:leading-8">
            Un espacio para construir fuerza, disciplina y progreso medible. Acá el
            foco no es posar: es sostener una rutina que te cambie de verdad.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:mt-8 md:justify-start">
            <Link to="/register">
              <Button className="w-full sm:w-auto px-8 py-4 text-sm font-heading uppercase tracking-[0.2em] sm:text-base">
                Asociate Ahora
              </Button>
            </Link>
            <Button
              onClick={() => scrollTo('plans')}
              variant="secondary"
              className="w-full sm:w-auto px-8 py-4 text-sm font-heading uppercase tracking-[0.2em] sm:text-base"
            >
              Ver Planes
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;

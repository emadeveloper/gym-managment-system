import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import HeroBanner from '../../docs/img/hero-banner-4.png';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HeroBanner}
          alt="La Resistencia Hero Banner"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/80 to-black/90 md:bg-linear-to-r md:from-black/95 md:via-black/70 md:to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-72 sm:py-72 lg:py-32 flex flex-col lg:flex-row items-center lg:items-center gap-10">
        {/* Text block */}
        <div className="w-full lg:w-3/5 lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight tracking-tight uppercase">
            No viniste a encajar.
            <span className="block text-primary mt-1 ">
              Viniste a Resistir.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0">
            El último bastión del entrenamiento real. Sin circo. Solo Resultados.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Link to="/register">
              <Button className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base lg:text-lg uppercase font-heading">
                Asociate Ahora
              </Button>
            </Link>
            <Link to="#plans">
              <Button
                variant="secondary"
                className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base lg:text-lg uppercase font-heading"
              >
                Ver Planes
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty flex space on large screens to balance layout */}
        <div className="hidden lg:block w-2/5" aria-hidden="true" />
      </div>
    </section>
  );
};

export default HeroSection;


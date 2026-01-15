import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
// Importá tus imágenes (opcional)
// import GymInterior from '../../docs/img/gym-interior.jpg';
// import TrainerPhoto from '../../docs/img/trainer.jpg';

const AboutSection = () => {
  return (
    <section className="relative w-full bg-black py-20 lg:py-32">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded text-primary text-sm font-heading uppercase tracking-wider mb-10">
            - Nuestra Historia -
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white uppercase tracking-tight">
            Esto No Es Solo Un Gym.
            <span className="block text-primary mt-2">Es la Resistencia.</span>
          </h2>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Left Column - Story */}
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase mb-4">
                El Origen
              </h3>
              <p className="text-gray-300 leading-relaxed">
                En 2020, en plena pandemia, cuando los gimnasios cerraban y las excusas 
                abundaban, <span className="text-white font-semibold">decidimos hacer algo diferente</span>. 
                No queríamos ser otro gym más con máquinas de colores y música comercial.
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Queríamos crear un <span className="text-primary font-semibold">espacio real</span> para 
              gente real. Sin poses. Sin filtros. Solo hierro, sudor y objetivos cumplidos.
            </p>

            <p className="text-gray-300 leading-relaxed">
              <span className="text-white font-semibold">La Resistencia</span> nació de la frustración 
              con el fitness superficial. Nació de creer que el entrenamiento es más que una foto 
              en Instagram. Es <span className="text-primary font-semibold">disciplina, comunidad y transformación real</span>.
            </p>

            <div className="bg-primary-bg border border-gray-600 rounded-lg p-6 mt-8">
              <blockquote className="text-lg text-gray-300 italic">
                "No prometemos resultados mágicos en 30 días. Prometemos un lugar donde 
                <span className="text-primary font-semibold not-italic"> nadie te va a juzgar por empezar desde cero</span>, 
                y todos te van a empujar a ser mejor que ayer."
              </blockquote>
              <cite className="block mt-4 text-sm text-gray-500 not-italic">
                — Fundadores, La Resistencia
              </cite>
            </div>
          </div>

          {/* Right Column - Values */}
          <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase mb-4">
                Nuestros Valores
              </h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                No son frases bonitas en la pared. Son reglas que vivimos cada día.
              </p>
            </div>

            {/* Values Cards */}
            <div className="space-y-6">
              {/* Value 1 */}
              <div className="bg-linear-to-r from-primary/10 to-transparent border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* <span className="text-4xl">💪</span> */}
                  <div>
                    <h4 className="text-xl font-heading font-bold text-white uppercase mb-2">
                      Sin Excusas
                    </h4>
                    <p className="text-gray-400 text-sm">
                      No importa de dónde venís ni qué tan perdido te sentís. 
                      Acá todos empezaron en el mismo lugar: el día uno.
                    </p>
                  </div>
                </div>
              </div>

              {/* Value 2 */}
              <div className="bg-linear-to-r from-primary/10 to-transparent border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* <span className="text-4xl">🔥</span> */}
                  <div>
                    <h4 className="text-xl font-heading font-bold text-white uppercase mb-2">
                      Resultados Reales
                    </h4>
                    <p className="text-gray-400 text-sm">
                      No vendemos humo. Vendemos trabajo duro, consistencia y 
                      un camino probado hacia tus objetivos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Value 3 */}
              <div className="bg-linear-to-r from-primary/10 to-transparent border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* <span className="text-4xl">🤝</span> */}
                  <div>
                    <h4 className="text-xl font-heading font-bold text-white uppercase mb-2">
                      Comunidad Primero
                    </h4>
                    <p className="text-gray-400 text-sm">
                      No sos un número de membresía. Sos parte de algo más grande. 
                      Acá todos empujan a todos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Value 4 */}
              <div className="bg-linear-to-r from-primary/10 to-transparent border border-primary/30 rounded-lg p-6 hover:border-primary/60 transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* <span className="text-4xl">⚡</span> */}
                  <div>
                    <h4 className="text-xl font-heading font-bold text-white uppercase mb-2">
                      Autenticidad Total
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Cero poses. Cero ego. Solo gente real entrenando de verdad 
                      en un lugar sin filtros.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-b border-gray-800 py-12 mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-2">
                2020
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Año de Fundación
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-2">
                500+
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Miembros Activos
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Acceso al Gym
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-2">
                100%
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Sin Contratos
              </div>
            </div>
          </div>
        </div>

        {/* Team Preview (Optional) */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-heading font-bold text-white uppercase">
              El Equipo
            </h3>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              No somos entrenadores celebrities. Somos gente que vive lo que enseña.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="group relative bg-gray-800 border border-gray-800 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300">
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                {/* Placeholder - reemplazar con imagen real */}
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-heading font-bold text-white uppercase mb-1">
                  Guillermo Martínez
                </h4>
                <p className="text-primary text-sm font-semibold mb-3">
                  Fundador & Head Coach
                </p>
                <p className="text-gray-400 text-sm">
                  15 años de experiencia entrenando a gente de todas las edades y niveles.
                  Certificado en Musculación y Nutrición Deportiva.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group relative bg-gray-800 border border-gray-800 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300">
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-heading font-bold text-white uppercase mb-1">
                  Rocío Foss
                </h4>
                <p className="text-primary text-sm font-semibold mb-3">
                  Coach y Fisico Dietista.
                </p>
                <p className="text-gray-400 text-sm">
                  Especializada en composición corporal y rendimiento atlético.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group relative bg-gray-800 border border-gray-800 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300">
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                  <span className="text-6xl">👤</span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-heading font-bold text-white uppercase mb-1">
                  Julián Martínez
                </h4>
                <p className="text-primary text-sm font-semibold mb-3">
                  Coach de Fuerza
                </p>
                <p className="text-gray-400 text-sm">
                  10 años entrenando . Especializado en el entrenamiento de fuerza y potencia.
                  Pasión por el hierro.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 rounded-2xl p-12">
          <h3 className="text-3xl sm:text-4xl font-heading font-bold text-white uppercase mb-4">
            ¿Listo Para Unirte?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            No te prometemos que va a ser fácil. Te prometemos que va a valer la pena.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="px-8 py-3 text-lg uppercase font-heading">
                Asociate Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent" />
    </section>
  );
};

export default AboutSection;
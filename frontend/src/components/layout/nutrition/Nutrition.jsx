import React from 'react';
import { Card } from '../../ui/Card';
import NutritionCard from './NutritionCard';
import NutritionMeals from './NutritionMeals';
import NutritionMacros from './NutritionMacros';
import EmptyState from '../dashboard/EmptyState';

import { Apple } from 'lucide-react';

const Nutrition = ({ user, nutritionData = null }) => {
  if (!nutritionData) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
              Nutrición
            </p>
            <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
              Tu plan nutricional
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Cuando el equipo cargue un plan para vos, lo vas a ver acá con macros,
              comidas, recomendaciones y descarga directa.
            </p>
          </div>
        </section>

        <EmptyState
          icon={Apple}
          title="Sin plan nutricional"
          description="Un nutricionista personalizado puede crear un plan adaptado a tus objetivos y necesidades. Incluirá comidas balanceadas, macros personalizados y consejos para optimizar tu nutrición."
          actionText="Solicitar plan nutricional"
          actionCallback={() => console.log('Solicitar plan nutricional')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-3xl border border-gray-800 bg-surface p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-heading uppercase tracking-[0.24em] text-gray-500">
              Nutrición
            </p>
            <h1 className="mt-3 text-3xl font-heading font-bold uppercase text-foreground sm:text-4xl">
              Tu plan nutricional
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Plan personalizado con macros, horarios, comidas y soporte diario para
              sostener el objetivo sin improvisar.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
            <Apple className="h-7 w-7" />
          </div>
        </div>
      </section>

      <NutritionCard user={user} nutritionData={nutritionData} />
      <NutritionMacros macros={nutritionData.dailyMacros} />
      <NutritionMeals meals={nutritionData.meals} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="border-b border-gray-800 pb-4">
            <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">
              Soporte
            </p>
            <h3 className="mt-2 text-lg font-heading font-bold text-foreground">
              Recomendaciones
            </h3>
          </div>
          <ul className="mt-5 space-y-3">
            {nutritionData.tips?.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 rounded-2xl border border-gray-800 bg-surface-light px-4 py-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-gray-300 text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
          <div className="border-b border-gray-800 pb-4">
            <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">
              Ajustes
            </p>
            <h3 className="mt-2 text-lg font-heading font-bold text-foreground">
              Restricciones y suplementos
            </h3>
          </div>
          
          {nutritionData.restrictions?.length > 0 && (
            <div className="mb-6 mt-5">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-3">
                Restricciones Dietéticas
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {nutritionData.restrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-400 border border-red-500/40"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {nutritionData.supplements?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-3">
                Suplementos Recomendados
              </p>
              <div className="space-y-2">
                {nutritionData.supplements.map((supplement, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-800 bg-surface-light p-3 text-sm text-gray-300"
                  >
                    <span className="text-green-300 mt-1 mx-2">✓</span>
                    <span className="text-gray-300 text-sm">{supplement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Nutrition;

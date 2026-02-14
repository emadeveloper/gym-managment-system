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
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
            Tu Plan Nutricional
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Un nutricionista personalizado creará tu plan alimenticio ideal.
          </p>
        </div>

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
    <div className="space-y-2">
      
      {/* Header */}
      <div className='flex gap-3 items-center justify-center'>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground">
          Tu Plan Nutricional
        </h1>
        <Apple className='text-primary w-12 h-12'/>
      </div>
        <p className="text-sm sm:text-base text-gray-400 pb-3 text-center">
          Tu Plan personalizado diseñado para alcanzar tus objetivos de salud y fitness.
        </p>

      {/* Info Card */}
      <NutritionCard user={user} nutritionData={nutritionData} />

      {/* Macros Chart */}
      <NutritionMacros macros={nutritionData.dailyMacros} />

      {/* Meals */}
      <NutritionMeals meals={nutritionData.meals} />

      {/* Tips and Restrictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Tips */}
        <Card className="bg-surface border border-gray-800">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4 pb-3">
            Recomendaciones
          </h3>
          <ul className="space-y-3">
            {nutritionData.tips?.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-gray-300 text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Restrictions & Supplements */}
        <Card className="bg-surface border border-gray-800">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4 pb-2">
            Restricciones & Suplementos
          </h3>
          
          {nutritionData.restrictions?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-3 pb-2">
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
              <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-3 pb-2">
                Suplementos Recomendados
              </p>
              <div className="space-y-2">
                {nutritionData.supplements.map((supplement, index) => (
                  <div
                    key={index}
                    className="p-2 bg-surface-light rounded border border-gray-700 text-sm text-gray-300"
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
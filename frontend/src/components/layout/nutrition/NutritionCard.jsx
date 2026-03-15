import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { downloadNutritionPdf } from '../../../utils/nutritionPdf';

export const NutritionCard = ({ user, nutritionData }) => {
  const { dailyMacros } = nutritionData;

  const downloadPDF = () => {
    try {
      downloadNutritionPdf({ user, nutritionData });
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Hubo un error al descargar el PDF. Intenta de nuevo.');
    }
  };

  // Calculate percentajes
  const proteinPercent = Math.round(
    (dailyMacros.protein * 4) / dailyMacros.calories * 100
  );
  const carbsPercent = Math.round(
    (dailyMacros.carbs * 4) / dailyMacros.calories * 100
  );
  const fatPercent = Math.round(
    (dailyMacros.fat * 9) / dailyMacros.calories * 100
  );

  return (
    <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-gray-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500 pb-1">
            Resumen diario
          </p>
          <h3 className="mt-2 text-lg font-heading font-bold text-foreground sm:text-xl pb-1">
            Información Nutricional
          </h3>
          <p className="mt-2 text-xs text-gray-400 sm:text-sm">
            Macros y calorías recomendadas para tu objetivo
          </p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.14em] text-gray-400">
          Revisión: {nutritionData.nextReview}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4 text-center">
        <div className="rounded-3xl border border-gray-800 bg-surface-light p-4">
          <p className="text-xs font-heading uppercase tracking-[0.16em] text-white">
            Calorías
          </p>
          <p className="mt-3 text-2xl font-heading font-bold text-foreground sm:text-3xl">
            {dailyMacros.calories}
          </p>
          <p className="text-xs text-gray-400 mt-1">kcal/día</p>
        </div>

        <div className="rounded-3xl border border-primary bg-primary p-4">
          <p className="text-xs font-heading uppercase tracking-[0.16em] text-white">
            Proteína
          </p>
          <p className="mt-3 text-2xl font-heading font-bold text-white sm:text-3xl">
            {dailyMacros.protein}g
          </p>
          <p className="mt-1 text-xs text-gray-300">{proteinPercent}%</p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-surface-light p-4">
          <p className="text-xs font-heading uppercase tracking-[0.16em] text-gray-300">
            Carbs
          </p>
          <p className="mt-3 text-2xl font-heading font-bold text-foreground sm:text-3xl">
            {dailyMacros.carbs}g
          </p>
          <p className="mt-1 text-xs text-gray-400">{carbsPercent}%</p>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-surface-light p-4">
          <p className="text-xs font-heading uppercase tracking-[0.16em] text-gray-300">
            Grasas
          </p>
          <p className="mt-3 text-2xl font-heading font-bold text-foreground sm:text-3xl">
            {dailyMacros.fat}g
          </p>
          <p className="mt-1 text-xs text-gray-400">{fatPercent}%</p>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <Button
          onClick={downloadPDF}
          className="w-full text-sm uppercase font-heading py-2 sm:w-[80%] md:w-[60%]"
        >
          Descargar Plan en PDF
        </Button>
      </div>
    </Card>
  );
};

export default NutritionCard;

import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { pdf } from '@react-pdf/renderer';
import NutritionPDF from './NutritionPdf';


export const NutritionCard = ({ user, nutritionData }) => {
  const { dailyMacros } = nutritionData;

  // Descargar PDF - Esta función SOLO se ejecuta al clickear el botón
  const downloadPDF = async () => {
    try {
      // Create document PDF (without render it on UI)
      const doc = <NutritionPDF user={user} nutritionData={nutritionData} />;
      
      // Convert to PDF
      const asPdf = pdf(doc);
      
      // Download
      asPdf.download(`plan-nutricional-${user?.name || 'usuario'}.pdf`);
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
    <Card className="bg-surface border border-gray-800">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700">
        <div>
          <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground pb-1">
            Información Nutricional Diaria
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Macros y calorías recomendadas para tu objetivo
          </p>
        </div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        
        {/* Cals */}
        <div className="p-4 bg-surface-light rounded-lg border border-gray-700">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-heading font-bold mb-2">
            Calorías
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {dailyMacros.calories}
          </p>
          <p className="text-xs text-gray-400 mt-1">kcal/día</p>
        </div>

        {/* Protein */}
        <div className="p-4 bg-surface-light rounded-lg border border-primary/40">
          <p className="text-xs uppercase tracking-widest text-primary font-heading font-bold mb-2">
            Proteína
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">
            {dailyMacros.protein}g
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {proteinPercent}%
          </p>
        </div>

        {/* Carbs */}
        <div className="p-4 bg-surface-light rounded-lg border border-orange-600/40">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-heading font-bold mb-2">
            Carbs
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-orange-400">
            {dailyMacros.carbs}g
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {carbsPercent}%
          </p>
        </div>

        {/* Fats */}
        <div className="p-4 bg-surface-light rounded-lg border border-blue-600/40">
          <p className="text-xs uppercase tracking-widest text-blue-400 font-heading font-bold mb-2">
            Grasas
          </p>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-blue-400">
            {dailyMacros.fat}g
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {fatPercent}%
          </p>
        </div>
      </div>

      {/* Download PDF Button */}
      <div className='flex justify-center items-center'>
        <Button
          onClick={downloadPDF}
          className="w-full sm:w-[80%] md:w-[60%] text-sm uppercase font-heading py-2"
        >
          Descargar Plan en PDF
        </Button>
      </div>
    </Card>
  );
};

export default NutritionCard;
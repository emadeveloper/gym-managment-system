import React from 'react';
import { Card } from '../../ui/Card';

const COLORS = ['#cc0000', '#9ca3af', '#4b5563'];

function buildMacroData(macros) {
  const proteinCalories = macros.protein * 4;
  const carbsCalories = macros.carbs * 4;
  const fatCalories = macros.fat * 9;
  const totalCalories = Math.max(
    macros.calories || 0,
    proteinCalories + carbsCalories + fatCalories,
    1,
  );

  return [
    {
      name: 'Proteina',
      value: Math.round((proteinCalories / totalCalories) * 100),
      calories: proteinCalories,
    },
    {
      name: 'Carbs',
      value: Math.round((carbsCalories / totalCalories) * 100),
      calories: carbsCalories,
    },
    {
      name: 'Grasas',
      value: Math.round((fatCalories / totalCalories) * 100),
      calories: fatCalories,
    },
  ];
}

export const NutritionMacros = ({ macros }) => {
  const macroData = buildMacroData(macros);

  return (
    <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
      <div className="border-b border-gray-800 pb-4">
        <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">
          Distribucion
        </p>
        <h3 className="mt-2 text-lg font-heading font-bold text-foreground">
          Macros diarios
        </h3>
      </div>

      <div className="mt-5 space-y-6">
        <div className="rounded-3xl border border-gray-800 bg-surface-light p-4 sm:p-5">
          <div className="flex h-5 overflow-hidden rounded-full border border-gray-800 bg-black/35">
            {macroData.map((macro, index) => (
              <div
                key={macro.name}
                className="h-full transition-all duration-300"
                style={{
                  width: `${macro.value}%`,
                  backgroundColor: COLORS[index],
                }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {macroData.map((macro, index) => (
              <div
                key={macro.name}
                className="rounded-2xl border border-gray-800 bg-black/20 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {macro.name}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-heading font-bold text-white">
                  {macro.value}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {macroData.map((macro, index) => (
            <div key={macro.name} className="rounded-3xl border border-gray-800 bg-surface-light p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-semibold text-foreground">{macro.name}</span>
                </div>
                <span className="text-2xl font-heading font-bold text-foreground">
                  {macro.value}%
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {macro.calories} kcal de {macros.calories} kcal totales
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default NutritionMacros;

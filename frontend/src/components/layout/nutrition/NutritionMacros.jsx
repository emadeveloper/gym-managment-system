import React from 'react';
import { Card } from '../../ui/Card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export const NutritionMacros = ({ macros }) => {
  // Calcular calorías por macro
  const proteinCalories = macros.protein * 4;
  const carbsCalories = macros.carbs * 4;
  const fatCalories = macros.fat * 9;

  const macroData = [
    {
      name: 'Proteína',
      value: Math.round((proteinCalories / macros.calories) * 100),
      calories: proteinCalories,
    },
    {
      name: 'Carbs',
      value: Math.round((carbsCalories / macros.calories) * 100),
      calories: carbsCalories,
    },
    {
      name: 'Grasas',
      value: Math.round((fatCalories / macros.calories) * 100),
      calories: fatCalories,
    },
  ];

  const COLORS = ['#cc0000', '#9ca3af', '#4b5563'];

  return (
    <Card className="border border-gray-800 bg-surface p-5 sm:p-6">
      <div className="border-b border-gray-800 pb-4">
        <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">
          Distribución
        </p>
        <h3 className="mt-2 text-lg font-heading font-bold text-foreground">
          Macros diarios
        </h3>
      </div>

      <div className="mt-5 flex flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#111111"
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) =>
                  `${props.payload.name}: ${props.payload.value}% (${Math.round(props.payload.calories)} kcal)`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          {macroData.map((macro, index) => (
            <div key={index} className="rounded-3xl border border-gray-800 bg-surface-light p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-semibold text-foreground">{macro.name}</span>
                </div>
                <span className="text-2xl font-heading font-bold text-foreground">{macro.value}%</span>
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

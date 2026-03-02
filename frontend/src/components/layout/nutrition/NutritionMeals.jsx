import React from "react";
import { Card } from "../../ui/Card";

export const NutritionMeals = ({ meals }) => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xs font-heading uppercase tracking-[0.18em] text-gray-500">
            Planificación
          </p>
          <h3 className="pt-3 text-lg font-heading font-bold text-foreground sm:text-2xl">
            Plan de comidas diarias
          </h3>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {meals.map((meal, mealIndex) => (
            <Card key={mealIndex} className="border border-gray-800 bg-surface p-5">
              <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h4 className="text-lg font-heading font-bold text-foreground">
                    {meal.name}
                  </h4>
                  <p className="text-sm text-gray-400">{meal.time}</p>
                </div>
                <span className="text-3xl">{meal.emoji || ''}</span>
              </div>
  
              {/* Food Items */}
              <div className="space-y-3 mb-4">
                {meal.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-4">
                    
                    {/* Imagen */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                    )}
  
                    {/* Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">
                      {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        Porción: {item.portion}
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Cal</p>
                          <p className="font-semibold text-foreground">{item.calories}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Pro</p>
                          <p className="font-semibold text-foreground">{item.protein}g</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Carb</p>
                          <p className="font-semibold text-foreground">{item.carbs}g</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Fat</p>
                          <p className="font-semibold text-foreground">{item.fat}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              <div className="rounded-2xl border border-gray-800 bg-surface-light p-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground text-sm">
                    Total
                  </span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-400">
                      {meal.items.reduce((acc, item) => acc + item.calories, 0)} kcal
                    </span>
                    <span className="text-gray-400">
                      Pro: {meal.items.reduce((acc, item) => acc + item.protein, 0)}g
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  export default NutritionMeals;

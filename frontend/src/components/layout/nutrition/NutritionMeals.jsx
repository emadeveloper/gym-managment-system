import React from "react";
import { Card } from "../../ui/Card";

export const NutritionMeals = ({ meals }) => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-heading font-bold text-foreground pb-4 text-center sm:text-2xl pt-3">
          Plan de Comidas Diarias
        </h3>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {meals.map((meal, mealIndex) => (
            <Card key={mealIndex} className="bg-surface border border-gray-800">
              {/* Meal header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
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
                      <div className="grid grid-cols-4 gap-1 text-xs">
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
  
              {/* Total Macros */}
              <div className="p-3 bg-surface-light rounded-lg border border-gray-700">
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
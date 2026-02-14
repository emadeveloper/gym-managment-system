/**
 * NUTRITION MOCK DATA
 * Datos de ejemplo para la sección de nutrición
 * Cambiar URLs de imágenes por tus propias imágenes o URLs reales
 */

const mockNutritionData = {
    user: {
      name: 'Juan Pérez',
      goal: 'Pérdida de grasa',
      activityLevel: 'Moderado',
    },
  
    dailyMacros: {
      calories: 2200,
      protein: 150,      // g
      carbs: 220,        // g
      fat: 75,           // g
    },
  
    meals: [
      {
        name: 'Desayuno 🌅',
        time: '07:00',
        emoji: '🥣',
        items: [
          {
            name: 'Avena con miel',
            portion: '50g avena + 1 cda miel',
            calories: 180,
            protein: 6,
            carbs: 30,
            fat: 4,
            image: 'https://images.unsplash.com/photo-1585518419759-0cd65d1be3f2?w=500&h=400&fit=crop',
          },
          {
            name: 'Plátano',
            portion: '1 mediano',
            calories: 105,
            protein: 1,
            carbs: 27,
            fat: 0,
            image: 'https://unsplash.com/es/fotos/un-solo-platano-sobre-un-fondo-blanco-A4IIDSz6bTM',
          },
          {
            name: 'Leche descremada',
            portion: '200ml',
            calories: 65,
            protein: 6,
            carbs: 9,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop',
          },
          {
            name: 'Almendras',
            portion: '20g (puñado)',
            calories: 114,
            protein: 4,
            carbs: 4,
            fat: 10,
            image: 'https://images.unsplash.com/photo-1585949391240-7d5b7627e9b3?w=500&h=400&fit=crop',
          },
        ],
      },
  
      {
        name: 'Almuerzo 🍗',
        time: '12:30',
        emoji: '🍽️',
        items: [
          {
            name: 'Pollo a la parrilla',
            portion: '200g pechuga',
            calories: 310,
            protein: 62,
            carbs: 0,
            fat: 6,
            image: 'https://images.unsplash.com/photo-1598598270453-e39eb2c96196?w=500&h=400&fit=crop',
          },
          {
            name: 'Arroz integral',
            portion: '100g cocido',
            calories: 110,
            protein: 3,
            carbs: 24,
            fat: 1,
            image: 'https://images.unsplash.com/photo-1537080185343-63d1d556b128?w=500&h=400&fit=crop',
          },
          {
            name: 'Brócoli al vapor',
            portion: '150g',
            calories: 52,
            protein: 5,
            carbs: 10,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=500&h=400&fit=crop',
          },
          {
            name: 'Aceite de oliva',
            portion: '1 cucharada',
            calories: 120,
            protein: 0,
            carbs: 0,
            fat: 14,
            image: 'https://images.unsplash.com/photo-1618768593063-9f81039dd3f6?w=500&h=400&fit=crop',
          },
        ],
      },
  
      {
        name: 'Merienda 🥤',
        time: '16:00',
        emoji: '🍌',
        items: [
          {
            name: 'Batido proteico',
            portion: '1 scoop (30g)',
            calories: 120,
            protein: 25,
            carbs: 3,
            fat: 1,
            image: 'https://images.unsplash.com/photo-1590080876286-cd4e4f00eccd?w=500&h=400&fit=crop',
          },
          {
            name: 'Leche descremada',
            portion: '200ml',
            calories: 65,
            protein: 6,
            carbs: 9,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop',
          },
          {
            name: 'Plátano',
            portion: '1 pequeño',
            calories: 90,
            protein: 1,
            carbs: 23,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
          },
        ],
      },
  
      {
        name: 'Cena 🍜',
        time: '19:30',
        emoji: '🥗',
        items: [
          {
            name: 'Pavo molido',
            portion: '150g',
            calories: 210,
            protein: 42,
            carbs: 0,
            fat: 5,
            image: 'https://images.unsplash.com/photo-1598599810694-9cd9d1c0a4b4?w=500&h=400&fit=crop',
          },
          {
            name: 'Boniato',
            portion: '150g cocido',
            calories: 103,
            protein: 1,
            carbs: 23,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1584622614875-2f3a59f6a513?w=500&h=400&fit=crop',
          },
          {
            name: 'Ensalada mixta',
            portion: '200g',
            calories: 50,
            protein: 2,
            carbs: 8,
            fat: 1,
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
          },
          {
            name: 'Limón y vinagre',
            portion: 'al gusto',
            calories: 5,
            protein: 0,
            carbs: 1,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1587287435671-147b9fda8dfe?w=500&h=400&fit=crop',
          },
        ],
      },
    ],
  
    restrictions: [
      'Sin gluten',
      'Sin lácteos (excepto en desayuno)',
      'Bajo en sodio',
    ],
  
    supplements: [
      'Proteína en polvo (Whey Protein) - 30g diarios',
      'Vitamina D3 - 2000 IU diarios',
      'Omega-3 - 2000mg diarios',
      'Multivitamínico - 1 diario',
      'Creatina - 5g diarios',
    ],
  
    tips: [
      'Bebe al menos 3 litros de agua diariamente, especialmente antes y después del entrenamiento',
      'Come cada 3-4 horas para mantener estable el metabolismo',
      'Prepara las comidas con anticipación (meal prep) para evitar saltar comidas',
      'Consume proteína en cada comida para maximizar la síntesis proteica',
      'Come carbohidratos complejos (arroz integral, boniato) antes de entrenar',
      'Mantén un registro de lo que comes usando una app como MyFitnessPal',
      'Duerme 7-9 horas diarias para optimizar la recuperación y metabolismo',
      'Reduce el consumo de bebidas azucaradas y alcohol',
    ],
  
    createdDate: '12 de Febrero, 2026',
    nextReview: '12 de Mayo, 2026',
  };
  
  // ============================================================
  // CÓMO USAR EN TU COMPONENTE
  // ============================================================
  
  /**
   * En tu componente Nutrition.jsx:
   * 
   * import { mockNutritionData } from './mockNutritionData';
   * 
   * export const MyNutritionTab = ({ user }) => {
   *   return <Nutrition user={user} nutritionData={mockNutritionData} />;
   * };
   */
  
  // ============================================================
  // VARIACIONES DE DATOS POR OBJETIVO
  // ============================================================
  
  export const nutritionVariations = {
    // Para pérdida de grasa
    fatloss: {
      dailyMacros: {
        calories: 1800,
        protein: 140,
        carbs: 160,
        fat: 60,
      },
    },
  
    // Para ganancia muscular
    muscleGain: {
      dailyMacros: {
        calories: 2800,
        protein: 180,
        carbs: 300,
        fat: 90,
      },
    },
  
    // Para mantenimiento
    maintenance: {
      dailyMacros: {
        calories: 2200,
        protein: 150,
        carbs: 220,
        fat: 75,
      },
    },
  
    // Para atleta de élite
    elite: {
      dailyMacros: {
        calories: 3200,
        protein: 200,
        carbs: 360,
        fat: 100,
      },
    },
  };
  
  // ============================================================
  // GENERADOR DE MACROS AUTOMÁTICO
  // ============================================================
  
  export const generateMacrosFromCalories = (
    totalCalories,
    proteinGrams,
    carbs = null,
    fats = null
  ) => {
    // Si solo pasas calorías y proteína, calcula carbs y fats
    if (carbs === null && fats === null) {
      const carbCalories = totalCalories * 0.45; // 45% carbs
      const fatCalories = totalCalories * 0.25;  // 25% grasas
      const proteinCalories = proteinGrams * 4;
  
      return {
        calories: totalCalories,
        protein: proteinGrams,
        carbs: Math.round(carbCalories / 4),
        fat: Math.round(fatCalories / 9),
      };
    }
  
    return {
      calories: totalCalories,
      protein: proteinGrams,
      carbs: carbs,
      fat: fats,
    };
  };
  
  // Ejemplo de uso:
  // const macros = generateMacrosFromCalories(2200, 150);
  // Result: { calories: 2200, protein: 150, carbs: 247, fat: 61 }
  export default mockNutritionData;
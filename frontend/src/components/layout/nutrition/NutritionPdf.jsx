import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  // Página
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },

  // Header
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#cc0000',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 3,
  },

  logo: {
    width: 60,
    height: 60,
  },

  // Secciones
  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },

  // Info cards
  infoGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },

  infoCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },

  infoLabel: {
    fontSize: 10,
    color: '#999999',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },

  infoUnit: {
    fontSize: 10,
    color: '#666666',
  },

  // Tabla
  table: {
    width: '100%',
    marginBottom: 15,
  },

  tableHeader: {
    backgroundColor: '#cc0000',
    color: '#ffffff',
  },

  tableHeaderCell: {
    padding: 10,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  tableCell: {
    padding: 10,
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },

  // Comidas
  mealCard: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },

  mealName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },

  mealTime: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 8,
  },

  mealItems: {
    marginBottom: 8,
  },

  mealItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 6,
    fontSize: 9,
  },

  mealItemName: {
    flex: 2,
    color: '#000000',
  },

  mealItemPortion: {
    flex: 1,
    color: '#666666',
  },

  mealItemCals: {
    flex: 1,
    color: '#cc0000',
    fontWeight: 'bold',
  },

  mealTotal: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Tips
  tipItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 10,
  },

  tipBullet: {
    width: 15,
    marginRight: 8,
    color: '#cc0000',
    fontWeight: 'bold',
  },

  tipText: {
    flex: 1,
    color: '#333333',
  },

  // Footer
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    fontSize: 9,
    color: '#999999',
    textAlign: 'center',
  },

  footerText: {
    marginBottom: 5,
  },

  // Restricciones y suplementos
  badge: {
    display: 'inline-block',
    padding: '4 8',
    backgroundColor: '#ff9500',
    color: '#ffffff',
    fontSize: 9,
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5,
  },

  restrictionBadge: {
    display: 'inline-block',
    padding: '4 8',
    backgroundColor: '#ff6b6b',
    color: '#ffffff',
    fontSize: 9,
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5,
  },
});

/**
 * NutritionPDF
 * Documento PDF profesional con el plan nutricional del usuario
 */
const NutritionPDF = ({ user, nutritionData }) => {
  const { dailyMacros, meals, tips, restrictions, supplements, nextReview, createdDate } = nutritionData;

  // Calcular porcentajes de macros
  const proteinPercent = Math.round((dailyMacros.protein * 4 / dailyMacros.calories) * 100);
  const carbsPercent = Math.round((dailyMacros.carbs * 4 / dailyMacros.calories) * 100);
  const fatPercent = Math.round((dailyMacros.fat * 9 / dailyMacros.calories) * 100);

  return (
    <Document title={`Plan Nutricional - ${user?.name || 'Usuario'}`}>
      <Page size="A4" style={styles.page}>
        
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>📋 Plan Nutricional</Text>
            <Text style={styles.subtitle}>La Resistencia - Centro de Entrenamiento</Text>
            <Text style={styles.subtitle}>Usuario: {user?.name || 'Usuario'}</Text>
          </View>
        </View>

        {/* ===== INFORMACIÓN DEL USUARIO ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Información General</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Objetivo</Text>
              <Text style={styles.infoValue}>{nutritionData.user?.goal || 'No especificado'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Nivel de Actividad</Text>
              <Text style={styles.infoValue}>{nutritionData.user?.activityLevel || 'Moderado'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Plan Creado</Text>
              <Text style={styles.infoValue}>{createdDate}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Próxima Revisión</Text>
              <Text style={styles.infoValue}>{nextReview}</Text>
            </View>
          </View>
        </View>

        {/* ===== MACROS DIARIOS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Macronutrientes Diarios</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Calorías Totales</Text>
              <Text style={styles.infoValue}>{dailyMacros.calories}</Text>
              <Text style={styles.infoUnit}>kcal/día</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Proteína</Text>
              <Text style={styles.infoValue}>{dailyMacros.protein}g</Text>
              <Text style={styles.infoUnit}>{proteinPercent}% del total</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Carbohidratos</Text>
              <Text style={styles.infoValue}>{dailyMacros.carbs}g</Text>
              <Text style={styles.infoUnit}>{carbsPercent}% del total</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Grasas</Text>
              <Text style={styles.infoValue}>{dailyMacros.fat}g</Text>
              <Text style={styles.infoUnit}>{fatPercent}% del total</Text>
            </View>
          </View>
        </View>

        {/* ===== PLAN DE COMIDAS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Plan de Comidas Diarias</Text>
          
          {meals.map((meal, mealIndex) => {
            const mealCalories = meal.items.reduce((acc, item) => acc + item.calories, 0);
            const mealProtein = meal.items.reduce((acc, item) => acc + item.protein, 0);

            return (
              <View key={mealIndex} style={styles.mealCard}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>Hora: {meal.time}</Text>
                
                <View style={styles.mealItems}>
                  {meal.items.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.mealItem}>
                      <Text style={styles.mealItemName}>{item.name}</Text>
                      <Text style={styles.mealItemPortion}>{item.portion}</Text>
                      <Text style={styles.mealItemCals}>{item.calories} kcal</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.mealTotal}>
                  <Text>Total: {mealCalories} kcal | Proteína: {mealProtein}g</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ===== RESTRICCIONES ===== */}
        {restrictions && restrictions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Restricciones Dietéticas</Text>
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {restrictions.map((restriction, index) => (
                <View key={index} style={styles.restrictionBadge}>
                  <Text style={{ color: '#ffffff', fontSize: 9 }}>
                    {restriction}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== SUPLEMENTOS ===== */}
        {supplements && supplements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💊 Suplementos Recomendados</Text>
            <View>
              {supplements.map((supplement, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>✓</Text>
                  <Text style={styles.tipText}>{supplement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== TIPS ===== */}
        {tips && tips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Recomendaciones Importantes</Text>
            <View>
              {tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Este plan nutricional ha sido personalizado para {user?.name || 'el usuario'} basado en sus objetivos y nivel de actividad.
          </Text>
          <Text style={styles.footerText}>
            Se recomienda seguir este plan durante 4 semanas y luego revisar los resultados con el nutricionista.
          </Text>
          <Text style={styles.footerText}>
            © 2026 La Resistencia - Todos los derechos reservados
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default NutritionPDF;
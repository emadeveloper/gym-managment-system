WITH seed(name, goal, type, calories, activity_level, protein, carbs, fat, restrictions, supplements, tips, description) AS (
    VALUES
        ('Hipertrofia base 2800', 'Hipertrofia', 'Plantilla', 2800, 'Alto', 180, 330, 75, NULL, 'Creatina', 'Distribuir proteína en 4 comidas', 'Plantilla para etapa de volumen limpio.'),
        ('Definición controlada 2100', 'Pérdida de grasa', 'Plantilla', 2100, 'Moderado', 170, 190, 65, 'Reducir ultraprocesados', 'Cafeína', 'Mantener pasos diarios altos', 'Plantilla para recorte gradual con adherencia.'),
        ('Mantenimiento activo 2400', 'Mantenimiento', 'Plantilla', 2400, 'Moderado', 155, 260, 70, NULL, NULL, 'Revisar peso cada 2 semanas', 'Plantilla para sostener rendimiento y composición corporal.')
)
INSERT INTO nutrition_templates (
    id,
    name,
    goal,
    type,
    calories,
    activity_level,
    protein,
    carbs,
    fat,
    restrictions,
    supplements,
    tips,
    description,
    active,
    created_at,
    updated_at
)
SELECT
    (
        substr(md5(seed.name), 1, 8) || '-' ||
        substr(md5(seed.name), 9, 4) || '-' ||
        '4' || substr(md5(seed.name), 14, 3) || '-' ||
        'a' || substr(md5(seed.name), 18, 3) || '-' ||
        substr(md5(seed.name), 21, 12)
    )::uuid,
    seed.name,
    seed.goal,
    seed.type,
    seed.calories,
    seed.activity_level,
    seed.protein,
    seed.carbs,
    seed.fat,
    seed.restrictions,
    seed.supplements,
    seed.tips,
    seed.description,
    TRUE,
    NOW(),
    NOW()
FROM seed
ON CONFLICT DO NOTHING;

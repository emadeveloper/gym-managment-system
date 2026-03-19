INSERT INTO routine_template_days (
    id,
    routine_template_id,
    day_order,
    name,
    description,
    created_at,
    updated_at
)
SELECT
    (
        substr(md5(day_seed.template_name || '-' || day_seed.day_order), 1, 8) || '-' ||
        substr(md5(day_seed.template_name || '-' || day_seed.day_order), 9, 4) || '-' ||
        '4' || substr(md5(day_seed.template_name || '-' || day_seed.day_order), 14, 3) || '-' ||
        'a' || substr(md5(day_seed.template_name || '-' || day_seed.day_order), 18, 3) || '-' ||
        substr(md5(day_seed.template_name || '-' || day_seed.day_order), 21, 12)
    )::uuid,
    rt.id,
    day_seed.day_order,
    day_seed.day_name,
    day_seed.description,
    NOW(),
    NOW()
FROM (
    VALUES
        ('Fuerza full body inicial', 1, 'Dia 1 - Full body A', 'Enfasis en sentadilla y empujes.'),
        ('Fuerza full body inicial', 2, 'Dia 2 - Full body B', 'Enfasis en bisagra y tirones.'),
        ('Fuerza full body inicial', 3, 'Dia 3 - Full body C', 'Trabajo global con volumen moderado.'),
        ('Hipertrofia torso pierna', 1, 'Dia 1 - Torso', 'Empuje y tracción superior.'),
        ('Hipertrofia torso pierna', 2, 'Dia 2 - Pierna', 'Base de cuádriceps y cadena posterior.'),
        ('Hipertrofia torso pierna', 3, 'Dia 3 - Torso B', 'Volumen complementario de torso.'),
        ('Hipertrofia torso pierna', 4, 'Dia 4 - Pierna B', 'Glúteos, femorales y core.')
) AS day_seed(template_name, day_order, day_name, description)
JOIN routine_templates rt ON rt.name = day_seed.template_name
LEFT JOIN routine_template_days existing
    ON existing.routine_template_id = rt.id AND existing.day_order = day_seed.day_order
WHERE existing.id IS NULL;

INSERT INTO routine_template_exercises (
    id,
    routine_template_day_id,
    exercise_id,
    exercise_name,
    order_index,
    target_sets,
    target_reps,
    target_rep_range_min,
    target_rep_range_max,
    suggested_weight,
    rest_seconds,
    coach_notes,
    thumbnail_url,
    video_url,
    instructions,
    created_at,
    updated_at
)
SELECT
    (
        substr(md5(exercise_seed.template_name || '-' || exercise_seed.day_order || '-' || exercise_seed.order_index), 1, 8) || '-' ||
        substr(md5(exercise_seed.template_name || '-' || exercise_seed.day_order || '-' || exercise_seed.order_index), 9, 4) || '-' ||
        '4' || substr(md5(exercise_seed.template_name || '-' || exercise_seed.day_order || '-' || exercise_seed.order_index), 14, 3) || '-' ||
        'a' || substr(md5(exercise_seed.template_name || '-' || exercise_seed.day_order || '-' || exercise_seed.order_index), 18, 3) || '-' ||
        substr(md5(exercise_seed.template_name || '-' || exercise_seed.day_order || '-' || exercise_seed.order_index), 21, 12)
    )::uuid,
    day_entity.id,
    exercises.id,
    exercise_seed.exercise_name,
    exercise_seed.order_index,
    exercise_seed.target_sets,
    exercise_seed.target_reps,
    NULL,
    NULL,
    NULL,
    90,
    exercise_seed.coach_notes,
    NULL,
    NULL,
    exercises.instructions,
    NOW(),
    NOW()
FROM (
    VALUES
        ('Fuerza full body inicial', 1, 1, 'Sentadilla trasera', 4, 5, 'Carga técnica'),
        ('Fuerza full body inicial', 1, 2, 'Press banca con barra', 4, 6, 'RPE 8'),
        ('Fuerza full body inicial', 2, 1, 'Peso muerto rumano', 4, 6, 'Recorrido controlado'),
        ('Fuerza full body inicial', 2, 2, 'Remo con barra', 4, 8, 'Espalda neutra'),
        ('Fuerza full body inicial', 3, 1, 'Press militar', 3, 8, 'Sin hiperextender lumbar'),
        ('Fuerza full body inicial', 3, 2, 'Plancha frontal', 3, 30, 'Segundos por serie'),
        ('Hipertrofia torso pierna', 1, 1, 'Press banca con barra', 4, 8, 'Ultima serie cerca del fallo'),
        ('Hipertrofia torso pierna', 1, 2, 'Jalon al pecho', 4, 10, 'Pausa abajo'),
        ('Hipertrofia torso pierna', 2, 1, 'Sentadilla trasera', 4, 8, 'Control de tempo'),
        ('Hipertrofia torso pierna', 2, 2, 'Prensa inclinada', 3, 12, 'No despegar la cadera'),
        ('Hipertrofia torso pierna', 3, 1, 'Press inclinado con mancuernas', 4, 10, 'Recorrido completo'),
        ('Hipertrofia torso pierna', 3, 2, 'Remo con barra', 4, 10, 'Codos hacia atras'),
        ('Hipertrofia torso pierna', 4, 1, 'Hip thrust', 4, 10, 'Pausa arriba'),
        ('Hipertrofia torso pierna', 4, 2, 'Peso muerto rumano', 3, 10, 'Bisagra pura')
) AS exercise_seed(template_name, day_order, order_index, exercise_name, target_sets, target_reps, coach_notes)
JOIN routine_templates rt ON rt.name = exercise_seed.template_name
JOIN routine_template_days day_entity
    ON day_entity.routine_template_id = rt.id
    AND day_entity.day_order = exercise_seed.day_order
LEFT JOIN routine_template_exercises existing
    ON existing.routine_template_day_id = day_entity.id
    AND existing.order_index = exercise_seed.order_index
LEFT JOIN exercises ON exercises.name = exercise_seed.exercise_name
WHERE existing.id IS NULL;

WITH seed(name, slug, muscle_group, equipment, exercise_type, description, instructions, thumbnail_path, thumbnail_alt) AS (
    VALUES
        ('Press banca con barra', 'press-banca-con-barra', 'Pecho', 'Barra', 'Compuesto', 'Empuje horizontal para fuerza.', 'Escapulas retraidas y control de barra.', '/exercises/press-banca-con-barra.webp', 'Press banca con barra'),
        ('Press inclinado con mancuernas', 'press-inclinado-con-mancuernas', 'Pecho', 'Mancuernas', 'Compuesto', 'Trabajo de pectoral superior.', 'Bajada controlada y recorrido completo.', '/exercises/press-inclinado-mancuernas.webp', 'Press inclinado con mancuernas'),
        ('Aperturas en polea', 'aperturas-en-polea', 'Pecho', 'Polea', 'Aislado', 'Aislamiento de pectoral.', 'Mantener tension en todo el arco.', '/exercises/aperturas-en-polea.webp', 'Aperturas en polea'),
        ('Dominadas pronas', 'dominadas-pronas', 'Espalda', 'Peso corporal', 'Compuesto', 'Tiron vertical para dorsales.', 'Iniciar con retraccion escapular.', '/exercises/dominadas-pronas.webp', 'Dominadas pronas'),
        ('Remo con barra', 'remo-con-barra', 'Espalda', 'Barra', 'Compuesto', 'Tiron horizontal principal.', 'Espalda neutra y codos hacia atras.', '/exercises/remo-con-barra.webp', 'Remo con barra'),
        ('Jalon al pecho', 'jalon-al-pecho', 'Espalda', 'Polea', 'Compuesto', 'Alternativa de traccion vertical.', 'No balancear el torso.', '/exercises/jalon-al-pecho.webp', 'Jalon al pecho'),
        ('Fondos en paralelas', 'fondos-en-paralelas', 'Triceps', 'Peso corporal', 'Compuesto', 'Trabajo global de triceps.', 'Codos hacia atras, rango controlado.', '/exercises/fondos-en-paralelas.webp', 'Fondos en paralelas'),
        ('Extension triceps en polea', 'extension-triceps-en-polea', 'Triceps', 'Polea', 'Aislado', 'Aislamiento de triceps.', 'Bloquear hombros y extender codos.', '/exercises/extension-triceps-en-polea.webp', 'Extension triceps en polea'),
        ('Press frances', 'press-frances', 'Triceps', 'Barra', 'Aislado', 'Extension por encima de la cabeza.', 'No abrir codos al subir.', '/exercises/press-frances.webp', 'Press frances'),
        ('Curl barra recta', 'curl-barra-recta', 'Biceps', 'Barra', 'Aislado', 'Flexion de codo clasica.', 'Evitar impulso de cadera.', '/exercises/curl-barra-recta.webp', 'Curl barra recta'),
        ('Curl inclinado mancuernas', 'curl-inclinado-mancuernas', 'Biceps', 'Mancuernas', 'Aislado', 'Mayor estiramiento del biceps.', 'No adelantar hombros.', '/exercises/curl-inclinado-mancuernas.webp', 'Curl inclinado mancuernas'),
        ('Curl martillo', 'curl-martillo', 'Biceps', 'Mancuernas', 'Aislado', 'Trabajo de braquial y antebrazo.', 'Muneca neutra durante todo el gesto.', '/exercises/curl-martillo.webp', 'Curl martillo'),
        ('Sentadilla trasera', 'sentadilla-trasera', 'Piernas', 'Barra', 'Compuesto', 'Base de fuerza de tren inferior.', 'Rodillas siguen linea de pies.', '/exercises/sentadilla-trasera.webp', 'Sentadilla trasera'),
        ('Prensa inclinada', 'prensa-inclinada', 'Piernas', 'Maquina', 'Compuesto', 'Trabajo global de piernas.', 'No despegar cadera del respaldo.', '/exercises/prensa-inclinada.webp', 'Prensa inclinada'),
        ('Peso muerto rumano', 'peso-muerto-rumano', 'Piernas', 'Barra', 'Compuesto', 'Cadena posterior e isquios.', 'Cadera atras y espalda neutra.', '/exercises/peso-muerto-rumano.webp', 'Peso muerto rumano'),
        ('Hip thrust', 'hip-thrust', 'Gluteos', 'Barra', 'Compuesto', 'Extension de cadera para gluteos.', 'Pausa en contraccion arriba.', '/exercises/hip-thrust.webp', 'Hip thrust'),
        ('Abduccion en maquina', 'abduccion-en-maquina', 'Gluteos', 'Maquina', 'Aislado', 'Gluteo medio y estabilidad.', 'Movimiento controlado sin rebote.', '/exercises/abduccion-en-maquina.webp', 'Abduccion en maquina'),
        ('Elevaciones laterales', 'elevaciones-laterales', 'Hombros', 'Mancuernas', 'Aislado', 'Deltoide medio.', 'Codos levemente flexionados.', '/exercises/elevaciones-laterales.webp', 'Elevaciones laterales'),
        ('Press militar', 'press-militar', 'Hombros', 'Barra', 'Compuesto', 'Empuje vertical principal.', 'Core firme y recorrido vertical.', '/exercises/press-militar.webp', 'Press militar'),
        ('Pajaros en banco', 'pajaros-en-banco', 'Hombros', 'Mancuernas', 'Aislado', 'Deltoide posterior.', 'Subida hasta linea del hombro.', '/exercises/pajaros-en-banco.webp', 'Pajaros en banco'),
        ('Plancha frontal', 'plancha-frontal', 'Core', 'Peso corporal', 'Isometrico', 'Estabilidad del tronco.', 'Mantener cadera alineada.', '/exercises/plancha-frontal.webp', 'Plancha frontal'),
        ('Crunch en polea', 'crunch-en-polea', 'Core', 'Polea', 'Aislado', 'Flexion de tronco con carga.', 'Cerrar costillas hacia pelvis.', '/exercises/crunch-en-polea.webp', 'Crunch en polea'),
        ('Rueda abdominal', 'rueda-abdominal', 'Core', 'Rueda', 'Compuesto', 'Extension anti-flexion del core.', 'No colapsar lumbar.', '/exercises/rueda-abdominal.webp', 'Rueda abdominal'),
        ('Gemelos de pie', 'gemelos-de-pie', 'Pantorrillas', 'Maquina', 'Aislado', 'Trabajo de soleo y gastrocnemio.', 'Pausa en estiramiento abajo.', '/exercises/gemelos-de-pie.webp', 'Gemelos de pie'),
        ('Gemelos sentado', 'gemelos-sentado', 'Pantorrillas', 'Maquina', 'Aislado', 'Enfoque en soleo.', 'Subida explosiva y bajada lenta.', '/exercises/gemelos-sentado.webp', 'Gemelos sentado'),
        ('Remo al menton', 'remo-al-menton', 'Trapecio', 'Barra', 'Compuesto', 'Trapecio superior y deltoide.', 'No elevar hombros en exceso.', '/exercises/remo-al-menton.webp', 'Remo al menton'),
        ('Encogimientos con mancuernas', 'encogimientos-con-mancuernas', 'Trapecio', 'Mancuernas', 'Aislado', 'Aislamiento de trapecio.', 'Subir hombros en linea vertical.', '/exercises/encogimientos-con-mancuernas.webp', 'Encogimientos con mancuernas'),
        ('Face pull', 'face-pull', 'Espalda', 'Polea', 'Correctivo', 'Salud escapular y hombro posterior.', 'Tirar hacia la frente con codos altos.', '/exercises/face-pull.webp', 'Face pull'),
        ('Farmer walk', 'farmer-walk', 'Antebrazos', 'Mancuernas', 'Compuesto', 'Agarre y estabilidad global.', 'Caminar con tronco estable.', '/exercises/farmer-walk.webp', 'Farmer walk'),
        ('Curl invertido', 'curl-invertido', 'Antebrazos', 'Barra', 'Aislado', 'Fortalece extensores de antebrazo.', 'Muneca neutra en todo momento.', '/exercises/curl-invertido.webp', 'Curl invertido')
)
INSERT INTO exercises (
    id,
    name,
    slug,
    muscle_group,
    equipment,
    exercise_type,
    description,
    instructions,
    common_mistakes,
    thumbnail_url,
    thumbnail_path,
    thumbnail_alt,
    video_url,
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
    seed.slug,
    seed.muscle_group,
    seed.equipment,
    seed.exercise_type,
    seed.description,
    seed.instructions,
    NULL,
    NULL,
    seed.thumbnail_path,
    seed.thumbnail_alt,
    NULL,
    TRUE,
    NOW(),
    NOW()
FROM seed
ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    muscle_group = EXCLUDED.muscle_group,
    equipment = EXCLUDED.equipment,
    exercise_type = EXCLUDED.exercise_type,
    description = EXCLUDED.description,
    instructions = EXCLUDED.instructions,
    active = TRUE,
    thumbnail_path = COALESCE(NULLIF(TRIM(exercises.thumbnail_path), ''), EXCLUDED.thumbnail_path),
    thumbnail_alt = COALESCE(NULLIF(TRIM(exercises.thumbnail_alt), ''), EXCLUDED.thumbnail_alt),
    updated_at = NOW();

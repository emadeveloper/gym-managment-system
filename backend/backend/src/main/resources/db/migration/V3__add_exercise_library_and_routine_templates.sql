CREATE TABLE exercises (
    id UUID PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    slug VARCHAR(220),
    muscle_group VARCHAR(120) NOT NULL,
    equipment VARCHAR(120) NOT NULL,
    exercise_type VARCHAR(120) NOT NULL,
    description VARCHAR(300) NOT NULL,
    instructions TEXT NOT NULL,
    common_mistakes TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_exercises_name ON exercises (name);
CREATE INDEX idx_exercises_muscle_group ON exercises (muscle_group);
CREATE INDEX idx_exercises_equipment ON exercises (equipment);
CREATE INDEX idx_exercises_type ON exercises (exercise_type);
CREATE INDEX idx_exercises_active ON exercises (active);

CREATE TABLE routine_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    objective VARCHAR(160) NOT NULL,
    level VARCHAR(120) NOT NULL,
    days_per_week INTEGER NOT NULL,
    estimated_duration_weeks INTEGER,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_routine_templates_name ON routine_templates (name);
CREATE INDEX idx_routine_templates_active ON routine_templates (active);

CREATE TABLE routine_template_days (
    id UUID PRIMARY KEY,
    routine_template_id UUID NOT NULL,
    day_order INTEGER NOT NULL,
    name VARCHAR(180) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_template_days_template FOREIGN KEY (routine_template_id) REFERENCES routine_templates (id) ON DELETE CASCADE,
    CONSTRAINT uk_template_days_unique_order UNIQUE (routine_template_id, day_order)
);

CREATE INDEX idx_template_days_template ON routine_template_days (routine_template_id);

CREATE TABLE routine_template_exercises (
    id UUID PRIMARY KEY,
    routine_template_day_id UUID NOT NULL,
    exercise_id UUID,
    exercise_name VARCHAR(180) NOT NULL,
    order_index INTEGER NOT NULL,
    target_sets INTEGER,
    target_reps INTEGER,
    target_rep_range_min INTEGER,
    target_rep_range_max INTEGER,
    suggested_weight VARCHAR(120),
    rest_seconds INTEGER,
    coach_notes TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_template_exercises_day FOREIGN KEY (routine_template_day_id) REFERENCES routine_template_days (id) ON DELETE CASCADE,
    CONSTRAINT fk_template_exercises_library FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE SET NULL
);

CREATE INDEX idx_template_exercises_day ON routine_template_exercises (routine_template_day_id);
CREATE INDEX idx_template_exercises_order ON routine_template_exercises (routine_template_day_id, order_index);

ALTER TABLE routines
ADD COLUMN source_template_id UUID;

CREATE INDEX idx_routines_source_template ON routines (source_template_id);


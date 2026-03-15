CREATE TABLE user_assigned_routine_days (
    id UUID PRIMARY KEY,
    routine_id UUID NOT NULL,
    day_order INTEGER NOT NULL,
    name VARCHAR(180) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_user_assigned_days_routine FOREIGN KEY (routine_id) REFERENCES routines (id) ON DELETE CASCADE,
    CONSTRAINT uk_user_assigned_day_order UNIQUE (routine_id, day_order)
);

CREATE INDEX idx_user_assigned_days_routine ON user_assigned_routine_days (routine_id);

CREATE TABLE user_assigned_routine_exercises (
    id UUID PRIMARY KEY,
    user_assigned_routine_day_id UUID NOT NULL,
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
    CONSTRAINT fk_user_assigned_exercises_day FOREIGN KEY (user_assigned_routine_day_id) REFERENCES user_assigned_routine_days (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_assigned_exercises_library FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE SET NULL
);

CREATE INDEX idx_user_assigned_exercises_day ON user_assigned_routine_exercises (user_assigned_routine_day_id);
CREATE INDEX idx_user_assigned_exercises_order ON user_assigned_routine_exercises (user_assigned_routine_day_id, order_index);


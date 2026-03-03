CREATE TABLE routines (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    sessions_per_week INTEGER NOT NULL,
    weeks INTEGER NOT NULL,
    rest_window VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    coach VARCHAR(255) NOT NULL,
    exercises INTEGER NOT NULL,
    focus_area VARCHAR(255) NOT NULL,
    equipment VARCHAR(255) NOT NULL,
    notes_tag VARCHAR(255),
    notes TEXT,
    assigned_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_routines_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_routines_assigned_user ON routines (assigned_user_id);
CREATE INDEX idx_routines_status ON routines (status);

CREATE TABLE nutrition_plans (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    review_date DATE,
    activity_level VARCHAR(255) NOT NULL,
    protein INTEGER NOT NULL,
    carbs INTEGER NOT NULL,
    fat INTEGER NOT NULL,
    restrictions TEXT,
    supplements TEXT,
    tips TEXT,
    assigned_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_nutrition_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_nutrition_assigned_user ON nutrition_plans (assigned_user_id);
CREATE INDEX idx_nutrition_status ON nutrition_plans (status);

CREATE TABLE nutrition_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    goal VARCHAR(160) NOT NULL,
    type VARCHAR(120) NOT NULL,
    calories INTEGER NOT NULL,
    activity_level VARCHAR(120) NOT NULL,
    protein INTEGER NOT NULL,
    carbs INTEGER NOT NULL,
    fat INTEGER NOT NULL,
    restrictions TEXT,
    supplements TEXT,
    tips TEXT,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_nutrition_templates_name ON nutrition_templates (name);
CREATE INDEX idx_nutrition_templates_active ON nutrition_templates (active);

ALTER TABLE nutrition_plans
ADD COLUMN source_template_id UUID;

CREATE INDEX idx_nutrition_plans_source_template ON nutrition_plans (source_template_id);

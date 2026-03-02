CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    age INTEGER,
    height_cm INTEGER,
    weight_kg NUMERIC(5, 2),
    dni VARCHAR(255) UNIQUE,
    phone VARCHAR(255),
    current_subscription_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    profile_updated BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_email ON users (email);
CREATE INDEX idx_role ON users (role);
CREATE INDEX idx_is_active ON users (is_active);

CREATE TABLE user_trainers (
    user_id UUID NOT NULL,
    trainer_id UUID NOT NULL,
    PRIMARY KEY (user_id, trainer_id),
    CONSTRAINT fk_user_trainers_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_trainers_trainer FOREIGN KEY (trainer_id) REFERENCES users (id) ON DELETE CASCADE
);

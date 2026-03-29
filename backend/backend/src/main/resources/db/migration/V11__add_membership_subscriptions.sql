CREATE TABLE membership_subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    provider VARCHAR(100) NOT NULL,
    provider_reference VARCHAR(255) UNIQUE,
    external_reference VARCHAR(255) NOT NULL UNIQUE,
    plan_code VARCHAR(100) NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency_id VARCHAR(10) NOT NULL,
    payer_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    checkout_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE,
    current_period_end_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    last_webhook_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_membership_subscriptions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_membership_subscriptions_user_id ON membership_subscriptions (user_id);
CREATE INDEX idx_membership_subscriptions_status ON membership_subscriptions (status);
CREATE INDEX idx_membership_subscriptions_provider_reference ON membership_subscriptions (provider_reference);

CREATE TABLE processed_webhook_events (
    event_key VARCHAR(255) PRIMARY KEY,
    provider VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    action VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

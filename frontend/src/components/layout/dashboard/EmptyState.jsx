import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

const EmptyState = ({
    icon = '📭',
    title = 'Sin datos',
    description = 'No hay información disponible',
    actionText = null,
    actionCallback = null,
    variant = 'default',
    className = '',
}) => {
    return (
        <Card className={`bg-surface border border-gray-800 flex flex-col h-full ${className}`}>
            {/* Content wrapper */}
            <div>
                {/* Icon large */}
                <div className="flex justify-center mb-4">
                    <span className="text-6xl">{icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground text-center mb-2 pb-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 text-center mb-6 pb-4">
                    {description}
                </p>
            </div>

            {/* Button (optional) */}
            {actionText && actionCallback && (
                <Button
                    onClick={actionCallback}
                    variant={variant}
                    className="mt-auto w-full text-sm uppercase font-heading py-2 bg-primary text-white hover:bg-primary-dark active:bg-primary-dark rounded-3xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {actionText}
                </Button>
            )}
        </Card>

    );
};

export default EmptyState;
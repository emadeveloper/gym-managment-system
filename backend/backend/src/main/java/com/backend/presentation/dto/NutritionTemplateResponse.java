package com.backend.presentation.dto;

import java.util.UUID;

public record NutritionTemplateResponse(
        UUID id,
        String name,
        String goal,
        String type,
        Integer calories,
        Integer protein,
        Integer carbs,
        Integer fat,
        String activityLevel,
        String restrictions,
        String supplements,
        String tips,
        String description,
        Boolean active
) {
}

package com.backend.presentation.dto;

import java.util.UUID;

public record NutritionPlanResponse(
        UUID id,
        String name,
        String goal,
        Integer calories,
        String type,
        String status,
        String createdDate,
        String reviewDate,
        String activityLevel,
        Integer protein,
        Integer carbs,
        Integer fat,
        String restrictions,
        String supplements,
        String tips,
        String assignedMemberEmail,
        String assignedMemberName
) {
}

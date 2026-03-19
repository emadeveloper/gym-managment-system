package com.backend.presentation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NutritionTemplateUpsertRequest(
        @NotBlank String name,
        @NotBlank String goal,
        @NotBlank String type,
        @NotNull @Min(1) Integer calories,
        @NotNull @Min(1) Integer protein,
        @NotNull @Min(1) Integer carbs,
        @NotNull @Min(1) Integer fat,
        @NotBlank String activityLevel,
        String restrictions,
        String supplements,
        String tips,
        String description,
        Boolean active
) {
}

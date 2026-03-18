package com.backend.presentation.dto;

import jakarta.validation.constraints.NotBlank;

public record ExerciseRequest(
        @NotBlank String name,
        @NotBlank String muscleGroup,
        @NotBlank String equipment,
        @NotBlank String exerciseType,
        @NotBlank String description,
        @NotBlank String instructions,
        String commonMistakes,
        String thumbnailPath,
        String thumbnailAlt,
        String videoUrl,
        Boolean active
) {
}

package com.backend.presentation.dto;

import java.util.UUID;

public record ExerciseResponse(
        UUID id,
        String name,
        String slug,
        String muscleGroup,
        String equipment,
        String exerciseType,
        String description,
        String instructions,
        String commonMistakes,
        String thumbnailUrl,
        String videoUrl,
        Boolean active
) {
}


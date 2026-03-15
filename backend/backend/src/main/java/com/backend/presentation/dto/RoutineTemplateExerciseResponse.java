package com.backend.presentation.dto;

import java.util.UUID;

public record RoutineTemplateExerciseResponse(
        UUID id,
        UUID exerciseId,
        String exerciseName,
        Integer orderIndex,
        Integer targetSets,
        Integer targetReps,
        Integer targetRepRangeMin,
        Integer targetRepRangeMax,
        String suggestedWeight,
        Integer restSeconds,
        String coachNotes,
        String thumbnailUrl,
        String videoUrl,
        String instructions
) {
}


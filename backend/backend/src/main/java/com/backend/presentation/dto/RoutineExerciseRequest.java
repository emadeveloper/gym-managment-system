package com.backend.presentation.dto;

import jakarta.validation.constraints.Min;

import java.util.UUID;

public record RoutineExerciseRequest(
        UUID exerciseId,
        String exerciseName,
        @Min(1) Integer orderIndex,
        @Min(1) Integer targetSets,
        @Min(1) Integer targetReps,
        @Min(1) Integer targetRepRangeMin,
        @Min(1) Integer targetRepRangeMax,
        String suggestedWeight,
        @Min(0) Integer restSeconds,
        String coachNotes,
        String thumbnailUrl,
        String videoUrl,
        String instructions
) {
}


package com.backend.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RoutineDayRequest(
        @NotNull @Min(1) Integer dayOrder,
        @NotBlank String name,
        String description,
        @Valid List<RoutineExerciseRequest> exercises
) {
}


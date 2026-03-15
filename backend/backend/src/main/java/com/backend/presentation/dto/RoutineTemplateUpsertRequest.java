package com.backend.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RoutineTemplateUpsertRequest(
        @NotBlank String name,
        @NotBlank String objective,
        @NotBlank String level,
        @NotNull @Min(1) Integer daysPerWeek,
        @Min(1) Integer estimatedDurationWeeks,
        String description,
        Boolean active,
        @Valid List<RoutineDayRequest> days
) {
}


package com.backend.presentation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RoutineRequest(
        @NotBlank String name,
        @NotBlank String assignedMemberEmail,
        @NotBlank String goal,
        @NotBlank String level,
        @NotBlank String duration,
        @NotNull @Min(1) Integer sessionsPerWeek,
        @NotNull @Min(1) Integer weeks,
        String restWindow,
        @NotBlank String status,
        @NotBlank String coach,
        @NotNull @Min(1) Integer exercises,
        @NotBlank String focusArea,
        @NotBlank String equipment,
        String notesTag,
        String notes
) {
}

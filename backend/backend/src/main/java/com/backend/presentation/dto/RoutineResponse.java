package com.backend.presentation.dto;

import java.util.UUID;

public record RoutineResponse(
        UUID id,
        String name,
        String goal,
        String level,
        String duration,
        Integer sessionsPerWeek,
        Integer weeks,
        String restWindow,
        String status,
        String coach,
        Integer exercises,
        String focusArea,
        String equipment,
        String notesTag,
        String notes,
        String assignedMemberEmail,
        String assignedMemberName
) {
}

package com.backend.presentation.dto;

import java.util.List;
import java.util.UUID;

public record RoutineTemplateResponse(
        UUID id,
        String name,
        String objective,
        String level,
        Integer daysPerWeek,
        Integer estimatedDurationWeeks,
        String description,
        Boolean active,
        List<RoutineTemplateDayResponse> days
) {
}


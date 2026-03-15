package com.backend.presentation.dto;

import java.util.List;
import java.util.UUID;

public record RoutineTemplateDayResponse(
        UUID id,
        Integer dayOrder,
        String name,
        String description,
        List<RoutineTemplateExerciseResponse> exercises
) {
}


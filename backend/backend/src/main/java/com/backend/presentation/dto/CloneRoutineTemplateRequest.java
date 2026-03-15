package com.backend.presentation.dto;

import jakarta.validation.constraints.NotBlank;

public record CloneRoutineTemplateRequest(
        @NotBlank String name
) {
}


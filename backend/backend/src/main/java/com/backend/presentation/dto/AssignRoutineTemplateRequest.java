package com.backend.presentation.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignRoutineTemplateRequest(
        @NotBlank String assignedMemberEmail,
        @NotBlank String status,
        @NotBlank String coach
) {
}


package com.backend.presentation.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignNutritionTemplateRequest(
        @NotBlank String assignedMemberEmail,
        @NotBlank String status,
        String reviewDate
) {
}

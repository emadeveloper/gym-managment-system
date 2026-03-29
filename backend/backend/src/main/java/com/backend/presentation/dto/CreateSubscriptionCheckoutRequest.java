package com.backend.presentation.dto;

import jakarta.validation.constraints.Size;

public record CreateSubscriptionCheckoutRequest(
        @Size(max = 100, message = "Plan code cannot exceed 100 characters")
        String planCode
) {
}

package com.backend.infrastructure.adapter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequestDto (

        @NotBlank(message = "Email is required")
        @NotNull(message = "Email cannot be null")
        String email,

        @NotBlank(message = "Password is required")
        String password
){}

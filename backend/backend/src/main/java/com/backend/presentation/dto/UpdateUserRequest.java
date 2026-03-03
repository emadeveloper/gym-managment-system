package com.backend.presentation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Email(message = "Email must be valid")
        String email,

        @Size(min = 1, message = "Name cannot be blank")
        String name,

        @Size(min = 1, message = "Last name cannot be blank")
        String lastName,

        @Size(min = 1, message = "DNI cannot be blank")
        String dni,

        @Size(min = 1, message = "Phone cannot be blank")
        String phone,

        @Size(min = 6, message = "Password must be at least 6 characters")
        String password
) {}

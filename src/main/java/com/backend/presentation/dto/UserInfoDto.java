package com.backend.presentation.dto;

import java.time.Instant;
import java.util.UUID;

public record UserInfoDto(
        UUID id,
        String email,
        String name,
        String role,
        Instant createdAt,
        Instant lastLoginAt
) {}

package com.backend.presentation.dto;

import java.util.UUID;

public record UserResponse(UUID id, String email) {}

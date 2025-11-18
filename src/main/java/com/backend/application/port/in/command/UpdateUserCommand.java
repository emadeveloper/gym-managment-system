package com.backend.application.port.in.command;

import java.util.UUID;

public record UpdateUserCommand(
        UUID id,
        String email,
        String password
) {}
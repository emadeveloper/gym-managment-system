package com.backend.application.port.in.command;

import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;

import java.util.UUID;

public record UpdateUserCommand(
        UUID id,
        Email email,
        String password,
        Role role
) {}

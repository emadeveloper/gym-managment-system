package com.backend.application.port.in.command;

import java.util.UUID;

public record UpdatePasswordCommand(
        UUID userId,
        String oldPassword,
        String newPassword,
        String confirmPassword
) {
    public UpdatePasswordCommand {
        if (newPassword == null || !newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("New passwords do not match");
        }
    }
}
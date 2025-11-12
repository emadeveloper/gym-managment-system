package com.backend.application.port.in;

import com.backend.application.port.in.command.DeleteUserCommand;

import java.util.UUID;

public interface DeleteUserUseCase {
    void deleteUser(DeleteUserCommand command);
}

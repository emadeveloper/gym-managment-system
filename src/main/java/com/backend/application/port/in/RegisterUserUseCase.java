package com.backend.application.port.in;

import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.domain.model.User;

public interface RegisterUserUseCase {
    User registerUser(RegisterUserCommand command);
}

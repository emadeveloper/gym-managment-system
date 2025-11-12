package com.backend.application.port.in;

import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.domain.model.User;

public interface UpdateUserUseCase {
    User updateUser(UpdateUserCommand command);
}

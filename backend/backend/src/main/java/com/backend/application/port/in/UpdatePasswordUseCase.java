package com.backend.application.port.in;

import com.backend.application.port.in.command.UpdatePasswordCommand;

public interface UpdatePasswordUseCase {
    void execute (UpdatePasswordCommand command);
}

package com.backend.application.port.in;

import com.backend.domain.model.User;

import java.util.Optional;
import java.util.UUID;

public interface GetUserByIdUseCase {
    User getUserById(UUID id);
}

package com.backend.application.port.in;

import com.backend.domain.model.User;

import java.util.List;

public interface GetAllUsersUseCase {
    List<User> getAllUsers();
}

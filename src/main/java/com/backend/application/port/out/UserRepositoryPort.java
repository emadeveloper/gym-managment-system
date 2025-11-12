package com.backend.application.port.out;

import com.backend.application.port.in.command.DeleteUserCommand;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryPort {

    User save(User user);

    Optional<User> findByEmail(Email email);

    Optional<User> findById(UUID id);

    List<User> findAll();

    void deleteById (UUID id);
}

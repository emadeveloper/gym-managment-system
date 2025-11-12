package com.backend.infrastructure.adapter.out.persistence;

import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.infrastructure.adapter.out.persistence.mapper.UserMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@AllArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository userRepository;
    private final UserMapper mapper;

    @Override
    public User save(User user) {
        return null;
    }

    @Override
    public Optional<User> findByEmail(Email email) {
        return Optional.empty();
    }

    @Override
    public Optional<User> findById(UUID id) {
        return Optional.empty();
    }

    @Override
    public List<User> findAll() {
        return List.of();
    }

    @Override
    public void deleteById(UUID id) {

    }
}

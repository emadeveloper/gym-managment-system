package com.backend.infrastructure.adapter.out.persistence;

import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.User;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.mapper.UserPersistenceMapper;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@AllArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository repository;
    private final UserPersistenceMapper mapper;

    @Override
    public User save(User user) {
        UserJpaEntity entity = mapper.toEntity(user);
        UserJpaEntity savedUser = repository.save(entity);

        return mapper.toDomain(savedUser);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email)
                .map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<User> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(UUID id) {
        if (!repository.existsById(id)) {
            throw new UserNotFoundException("User with id " + id + " not found.");
        }
        repository.deleteById(id);
    }
}

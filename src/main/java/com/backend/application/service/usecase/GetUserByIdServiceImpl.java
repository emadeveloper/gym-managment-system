package com.backend.application.service.usecase;

import com.backend.application.port.in.GetUserByIdUseCase;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class GetUserByIdServiceImpl implements GetUserByIdUseCase {

    private final UserRepositoryPort userRepository;

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found."));
    }
}
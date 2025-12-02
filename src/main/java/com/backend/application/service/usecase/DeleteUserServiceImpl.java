package com.backend.application.service.usecase;

import com.backend.application.port.in.DeleteUserUseCase;
import com.backend.application.port.in.command.DeleteUserCommand;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.UserNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DeleteUserServiceImpl implements DeleteUserUseCase {

    private final UserRepositoryPort userRepository;

    @Override
    public void deleteUser(DeleteUserCommand command) {

        // Check if user exists
        userRepository.findById(command.id())
                        .orElseThrow(() -> new UserNotFoundException("User with id " + command.id() + " not found"));

        // Eliminate user
        userRepository.deleteById(command.id());
    }
}

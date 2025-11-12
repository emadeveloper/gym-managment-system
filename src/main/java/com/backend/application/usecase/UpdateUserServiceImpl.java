package com.backend.application.usecase;

import com.backend.application.port.in.UpdateUserUseCase;
import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UpdateUserServiceImpl implements UpdateUserUseCase {

    private final UserRepositoryPort userRepository;

    @Override
    public User updateUser(UpdateUserCommand command) {
        User existingUser = userRepository.findById(command.id())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.updateEmail(command.email());
        existingUser.updatePassword(command.password());
        existingUser.updateRole(command.role());

        return userRepository.save(existingUser);
    }
}

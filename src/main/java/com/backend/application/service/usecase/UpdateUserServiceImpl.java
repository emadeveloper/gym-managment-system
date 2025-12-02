package com.backend.application.service.usecase;

import com.backend.application.port.in.UpdateUserUseCase;
import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UpdateUserServiceImpl implements UpdateUserUseCase {

    private final UserRepositoryPort userRepository;

    @Override
    public User updateUser(UpdateUserCommand command) {
        User existingUser = userRepository.findById(command.id())
                .orElseThrow(() -> new UserNotFoundException("User with id " + command.id() + " not found."));

        if (command.email() != null) {
            existingUser.updateEmail(new Email(command.email()));
        }

        if (command.password() != null) {
            existingUser.updatePassword(command.password());

        }

        return userRepository.save(existingUser);
    }
}

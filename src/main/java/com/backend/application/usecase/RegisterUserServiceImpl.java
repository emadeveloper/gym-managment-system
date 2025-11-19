package com.backend.application.usecase;

import com.backend.application.port.in.RegisterUserUseCase;
import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.out.NotificationPort;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.UserAlreadyExistsException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegisterUserServiceImpl implements RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final NotificationPort notificationPort;

    @Override
    public User registerUser(RegisterUserCommand command) {

        if (userRepository.existsByEmail(command.email())) {
            throw new UserAlreadyExistsException("User with email: " + command.email() + "already exists");
        }

        // Create Value object Email
        Email emailVO = new Email(command.email());

        // Create entity from domain with command
        User user = new User(

                emailVO,
                command.password(),
                Role.USER
        );

        // Save Repository
        userRepository.save(user);

        // Send notification
        notificationPort.sendWelcomeEmail(user.getEmail().value(), "Welcome to the gym!");

        // Return user created
        return user;
    }
}

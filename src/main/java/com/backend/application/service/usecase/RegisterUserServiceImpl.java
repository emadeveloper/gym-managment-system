package com.backend.application.service.usecase;

import com.backend.application.port.in.RegisterUserUseCase;
import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.out.NotificationPort;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.UserAlreadyExistsException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegisterUserServiceImpl implements RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final NotificationPort notificationPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(RegisterUserCommand command) {

        if (userRepository.existsByEmail(command.email())) {
            throw new UserAlreadyExistsException("User with email: " + command.email() + "already exists");
        }

        // Create Value object Email
        Email emailVO;

        try {
            emailVO = new Email(command.email());
        } catch (IllegalArgumentException e) {
            throw new InvalidEmailException(e.getMessage());
        }

        // Create entity from domain with command
        User user = new User(
                emailVO,
                passwordEncoder.encode(command.password()),
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

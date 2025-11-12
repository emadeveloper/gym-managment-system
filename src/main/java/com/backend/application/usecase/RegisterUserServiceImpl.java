package com.backend.application.usecase;

import com.backend.application.port.in.RegisterUserUseCase;
import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.out.NotificationPort;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegisterUserServiceImpl implements RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final NotificationPort notificationPort;

    @Override
    public User registerUser(RegisterUserCommand command) {
        // Create entity from domain with command
        User user = new User(command.email(), command.password(), command.role());

        // Save Repository
        userRepository.save(user);

        // Send notification
        notificationPort.sendWelcomeEmail(user.getEmail(), "Welcome to the gym!");

        // Return user created
        return user;
    }
}

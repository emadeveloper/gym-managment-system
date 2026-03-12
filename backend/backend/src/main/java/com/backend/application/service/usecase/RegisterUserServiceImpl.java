package com.backend.application.service.usecase;

import com.backend.application.port.in.RegisterUserUseCase;
import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.out.NotificationPort;
import com.backend.application.port.out.TokenGeneratorPort;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.UserAlreadyExistsException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import com.backend.application.dto.RegisterResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RegisterUserServiceImpl implements RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final NotificationPort notificationPort;
    private final PasswordEncoder passwordEncoder;
    private final TokenGeneratorPort tokenGeneratorPort;

    @Override
    @Transactional
    public RegisterResponseDto registerUser(RegisterUserCommand command) {
        Email emailVO;
        try {
            emailVO = new Email(command.email());
        } catch (IllegalArgumentException e) {
            throw new InvalidEmailException(e.getMessage());
        }

        User.validateRawPassword(command.password());

        if (userRepository.existsByEmail(emailVO.value())) {
            throw new UserAlreadyExistsException("User with email: " + emailVO.value() + " already exists");
        }

        User user = new User(
                emailVO,
                passwordEncoder.encode(command.password()),
                Role.USER
        );
        // Save Repository
        User savedUser = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail().value())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String token = tokenGeneratorPort.generateToken(userDetails);

        // Send notification
        try {
            notificationPort.sendWelcomeEmail(user.getEmail().value(), "Welcome to the gym!");
        } catch (RuntimeException ex) {
            log.warn("Welcome email delivery failed for {}", user.getEmail().value(), ex);
        }

        // Return user created
        return new RegisterResponseDto(
                savedUser.getId(),
                savedUser.getEmail().value(),
                savedUser.getName(),
                savedUser.getLastName(),
                savedUser.getAge(),
                savedUser.getDni(),
                savedUser.getPhone(),
                savedUser.getRole().name(),
                token
        );
    }
}

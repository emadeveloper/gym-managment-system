package com.backend.application.usecase;

import com.backend.application.dto.RegisterResponseDto;
import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.out.NotificationPort;
import com.backend.application.port.out.TokenGeneratorPort;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.application.service.usecase.RegisterUserServiceImpl;
import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.UserAlreadyExistsException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterUserServiceImplTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private NotificationPort notificationPort;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenGeneratorPort tokenGeneratorPort;

    @InjectMocks
    private RegisterUserServiceImpl registerUserService;

    /* ---------------------------------------------------------------------- */
    /* Should register user successfully and return token                   */
    /* ---------------------------------------------------------------------- */
    @Test
    void registerUser_WhenEmailDoesNotExist_ShouldRegisterSuccessfully() {
        // Arrange
        RegisterUserCommand command = new RegisterUserCommand(
                "valid@email.com",
                "password123"
        );

        when(userRepository.existsByEmail(command.email())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(tokenGeneratorPort.generateToken(any())).thenReturn("jwt-token-123");

        User savedUser = new User(
                new Email("valid@email.com"),
                "hashedPassword",
                Role.USER
        );
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        RegisterResponseDto result = registerUserService.registerUser(command);

        // Assert
        assertNotNull(result);
        assertEquals("valid@email.com", result.email());
        assertEquals("USER", result.role());
        assertEquals("jwt-token-123", result.token());
        assertNotNull(result.id());

        verify(userRepository).existsByEmail(command.email());
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(tokenGeneratorPort).generateToken(any());
        verify(notificationPort).sendWelcomeEmail(eq(command.email()), anyString());
    }

    /* ---------------------------------------------------------------------- */
    /* Should throw UserAlreadyExistsException                              */
    /* ---------------------------------------------------------------------- */
    @Test
    void registerUser_WhenEmailAlreadyExists_ShouldThrowException() {
        // Arrange
        RegisterUserCommand command = new RegisterUserCommand(
                "already@exists.com",
                "123456"
        );

        when(userRepository.existsByEmail(command.email())).thenReturn(true);

        // Act + Assert
        assertThrows(UserAlreadyExistsException.class,
                () -> registerUserService.registerUser(command));

        verify(userRepository).existsByEmail(command.email());
        verify(passwordEncoder, never()).encode(any());
        verify(tokenGeneratorPort, never()).generateToken(any());
        verify(notificationPort, never()).sendWelcomeEmail(any(), any());
        verify(userRepository, never()).save(any());
    }

    /* ---------------------------------------------------------------------- */
    /* Should throw InvalidEmailException                                   */
    /* ---------------------------------------------------------------------- */
    @Test
    void registerUser_WithInvalidEmail_ShouldThrowInvalidEmailException() {
        // Arrange
        RegisterUserCommand command = new RegisterUserCommand(
                "invalid-email FORMAT WRONG",
                "pass"
        );

        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        // Act + Assert
        assertThrows(InvalidEmailException.class,
                () -> registerUserService.registerUser(command));

        verify(userRepository, never()).save(any());
        verify(notificationPort, never()).sendWelcomeEmail(any(), any());
        verify(tokenGeneratorPort, never()).generateToken(any());
    }

    /* ---------------------------------------------------------------------- */
    /* Should encode password before saving                                 */
    /* ---------------------------------------------------------------------- */
    @Test
    void registerUser_ShouldEncodePassword() {
        // Arrange
        RegisterUserCommand command = new RegisterUserCommand(
                "test@example.com",
                "plainPassword"
        );

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn("$2a$10$encodedPassword");
        when(tokenGeneratorPort.generateToken(any())).thenReturn("token");

        User savedUser = new User(
                new Email("test@example.com"),
                "$2a$10$encodedPassword",
                Role.USER
        );
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        RegisterResponseDto result = registerUserService.registerUser(command);

        // Assert
        assertNotNull(result);
        verify(passwordEncoder).encode("plainPassword");
        verify(userRepository).save(argThat(user ->
                user.getPassword().equals("$2a$10$encodedPassword")
        ));
    }
}
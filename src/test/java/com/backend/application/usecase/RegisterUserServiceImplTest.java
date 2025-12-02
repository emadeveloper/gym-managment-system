package com.backend.application.usecase;

import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.out.NotificationPort;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterUserServiceImplTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private NotificationPort notificationPort;

    @InjectMocks
    private RegisterUserServiceImpl registerUserService;

    /* ---------------------------------------------------------------------- */
    /* Should register user successfully                                    */
    /* ---------------------------------------------------------------------- */
    @Test
    void registerUser_WhenEmailDoesNotExist_ShouldRegisterSuccessfully() {

        // Arrange (Given)
        RegisterUserCommand command = new RegisterUserCommand(
                "valid@email.com",
                "password123"
        );

        when(userRepository.existsByEmail(command.email())).thenReturn(false);

        // Act (When)
        User result = registerUserService.registerUser(command);

        // Assert (Then)
        assertNotNull(result);
        assertEquals(new Email(command.email()), result.getEmail());
        assertEquals(Role.USER, result.getRole());

        verify(userRepository).existsByEmail(command.email());
        verify(userRepository).save(any(User.class));
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

        // Act + Assert
        assertThrows(InvalidEmailException.class,
                () -> registerUserService.registerUser(command));

        verify(userRepository, never()).save(any());
        verify(notificationPort, never()).sendWelcomeEmail(any(), any());
    }


}

package com.backend.application.usecase;

import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.application.service.usecase.UpdateUserServiceImpl;
import com.backend.domain.exception.InvalidPasswordException;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UpdateUserServiceImplTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UpdateUserServiceImpl service;

    @Test
    void shouldUpdateUserWhenExists() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        User existingUser = new User(
                new Email("old@email.com"),
                "oldPassword",
                Role.USER
        );

        UpdateUserCommand command = new UpdateUserCommand(
                id,
                "new@email.com",
                "newPassword"
        );

        when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        User updatedUser = service.updateUser(command);

        // ASSERT
        assertNotNull(updatedUser);
        assertEquals("new@email.com", updatedUser.getEmail().value());
        assertEquals("encodedNewPassword", updatedUser.getPassword());
        assertNotNull(updatedUser.getUpdatedAt());

        verify(userRepository, times(1)).findById(id);
        verify(userRepository, times(1)).save(existingUser);
        verify(passwordEncoder).encode("newPassword");
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotExist() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        UpdateUserCommand command = new UpdateUserCommand(
                id,
                "new@example.com",
                "newpass"
        );

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThrows(UserNotFoundException.class, () -> service.updateUser(command));

        verify(userRepository, times(1)).findById(id);
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldUpdateOnlyEmailWhenPasswordIsNull() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        User existingUser = new User(
                new Email("old@example.com"),
                "pass",
                Role.USER
        );

        UpdateUserCommand command = new UpdateUserCommand(
                id,
                "new@example.com",
                null
        );

        when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        User result = service.updateUser(command);

        // ASSERT
        assertEquals("new@example.com", result.getEmail().value());
        assertEquals("pass", result.getPassword());
        assertNotNull(result.getUpdatedAt());
    }

    @Test
    void shouldUpdateOnlyPasswordWhenEmailIsNull() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        User existingUser = new User(
                new Email("old@example.com"),
                "pass",
                Role.USER
        );

        UpdateUserCommand command = new UpdateUserCommand(
                id,
                null,
                "newPassword"
        );

        when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT
        User result = service.updateUser(command);

        // ASSERT
        assertEquals("old@example.com", result.getEmail().value());
        assertEquals("encodedNewPassword", result.getPassword());
        assertNotNull(result.getUpdatedAt());
        verify(passwordEncoder).encode("newPassword");
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsTooShort() {
        UUID id = UUID.randomUUID();
        User existingUser = new User(
                new Email("old@example.com"),
                "encodedPassword",
                Role.USER
        );

        UpdateUserCommand command = new UpdateUserCommand(
                id,
                null,
                "123"
        );

        when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));

        assertThrows(InvalidPasswordException.class, () -> service.updateUser(command));

        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any());
    }
}

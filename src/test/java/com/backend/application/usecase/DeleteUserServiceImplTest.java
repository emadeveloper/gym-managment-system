package com.backend.application.usecase;

import com.backend.application.port.in.command.DeleteUserCommand;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.application.service.usecase.DeleteUserServiceImpl;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeleteUserServiceImplTest {

    @Mock
    private UserRepositoryPort userRepository;

    @InjectMocks
    private DeleteUserServiceImpl service;

    @Test
    void shouldDeleteUserWhenExists() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        User existingUser = new User(new Email("example@test.com"), "1234", Role.USER);

        DeleteUserCommand command = new DeleteUserCommand(id);

        when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));


        // ACT
        service.deleteUser(command);

        // ASSERT
        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotExist() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        DeleteUserCommand command = new DeleteUserCommand(id);

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThrows(UserNotFoundException.class, () -> service.deleteUser(command));

        verify(userRepository, never()).deleteById(any());
    }

}

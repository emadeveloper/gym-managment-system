package com.backend.application.usecase;

import com.backend.application.port.out.UserRepositoryPort;
import com.backend.application.service.usecase.GetUserByIdServiceImpl;
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
class GetUserByIdServiceImplTest {

    @Mock
    private UserRepositoryPort userRepository;

    @InjectMocks
    private GetUserByIdServiceImpl service;

    @Test
    void shouldReturnUserWhenExists() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        User user = new User(new Email("text@example.com"), "123456", Role.USER);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        // ACT
        User result = service.getUserById(id);

        // ASSERT
        assertNotNull(result);
        assertEquals(user, result);

        verify(userRepository, times(1)).findById(id);
    }

    @Test
    void shouldThrowUserNotFoundWhenIdDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThrows(UserNotFoundException.class, () -> service.getUserById(id));

        verify(userRepository, times(1)).findById(id);
    }
}

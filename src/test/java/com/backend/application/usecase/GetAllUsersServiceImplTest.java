package com.backend.application.usecase;

import com.backend.application.port.out.UserRepositoryPort;
import com.backend.application.service.usecase.GetAllUsersServiceImpl;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetAllUsersServiceImplTest {

    @Mock
    private UserRepositoryPort userRepository;

    @InjectMocks
    private GetAllUsersServiceImpl service;

    @Test
    void shouldReturnAllUsersWhenExist() {
        // ARRANGE
        List<User> users = List.of(
                new User(new Email("alice@example.com"), "1234", Role.USER),
                new User(new Email("frank@example.com"), "1234", Role.USER),
                new User(new Email("jhon@example.com"), "1234", Role.USER)
        );

        when(userRepository.findAll()).thenReturn(users);

        // ACT
        List<User> result = service.getAllUsers();

        // ASSERT
        assertNotNull(result);
        assertIterableEquals(users, result);
        assertEquals(users, result);

        verify(userRepository, times(1)).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenUsersDoNotExist() {
        // ARRANGE
        when(userRepository.findAll()).thenReturn(List.of());

        // ACT
        List<User> result = service.getAllUsers();

        // ASSERT
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(userRepository, times(1)).findAll();
    }
}

package com.backend.application.usecase;

import com.backend.application.port.out.UserRepositoryPort;
import com.backend.application.service.usecase.LoginServiceImpl;
import com.backend.domain.exception.InvalidCredentialsException;
import com.backend.domain.model.User;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import com.backend.infrastructure.adapter.dto.LoginResponseDto;
import com.backend.security.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepositoryPort userRepository;

    @InjectMocks
    private LoginServiceImpl loginService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User(
                new Email("test@example.com"),
                "$2a$10$hashedPassword",
                Role.USER
        );
    }

    @Test
    void shouldLoginSuccessfully() {
        // ARRANGE
        String email = "test@example.com";
        String password = "Password123";

        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(email)
                .password("hashedPassword")
                .roles("USER")
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token-123");
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // ACT
        LoginResponseDto response = loginService.login(email, password);

        // ASSERT
        assertNotNull(response);
        assertEquals("jwt-token-123", response.token());
        assertNotNull(response.user());
        assertEquals(email, response.user().email());
        assertEquals("USER", response.user().role());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).generateToken(userDetails);
        verify(userRepository).save(testUser);
    }

    @Test
    void shouldThrowExceptionWhenCredentialsAreInvalid() {
        // ARRANGE
        when(authenticationManager.authenticate(any()))
                .thenThrow(new InvalidCredentialsException("Invalid credentials"));

        // ACT + ASSERT
        assertThrows(InvalidCredentialsException.class, () -> {
            loginService.login("wrong@example.com", "wrongPassword");
        });

        verify(jwtService, never()).generateToken(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldUpdateLastLoginAtOnSuccessfulLogin() {
        // ARRANGE
        String email = "test@example.com";
        String password = "Password123";

        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(email)
                .password("hashedPassword")
                .roles("USER")
                .build();

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtService.generateToken(any())).thenReturn("token");
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // ACT
        loginService.login(email, password);

        // ASSERT
        verify(userRepository).save(argThat(user ->
                user.getLastLoginAt() != null
        ));
    }
}
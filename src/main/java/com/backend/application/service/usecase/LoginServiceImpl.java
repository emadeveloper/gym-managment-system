package com.backend.application.service.usecase;

import com.backend.application.port.in.LoginUseCase;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.InvalidCredentialsException;
import com.backend.domain.model.User;
import com.backend.infrastructure.adapter.dto.LoginResponseDto;
import com.backend.presentation.dto.UserInfoDto;
import com.backend.security.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginUseCase {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepositoryPort userRepositoryPort;

    @Override
    public LoginResponseDto login(String email, String password) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // Extract user details authenticated
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Generate JWT token
            String token = jwtService.generateToken(userDetails);

            // Fetch full data from user repository
            User user = userRepositoryPort.findByEmail(email)
                    .orElseThrow(() -> new InvalidCredentialsException("User not found"));

            // Register last login update (optional)
            user.recordLogin();
            userRepositoryPort.save(user);

            // Create DTO with user info
            UserInfoDto userInfo = new UserInfoDto(
                    user.getId(),
                    user.getEmail().value(),
                    user.getName(),
                    user.getRole().name(),
                    user.getCreatedAt(),
                    user.getLastLoginAt()
            );

            // Return token + user info
            return new LoginResponseDto(token, userInfo);

        } catch (AuthenticationException e){
            throw new InvalidCredentialsException("Invalid email or password");
        }

    }
}

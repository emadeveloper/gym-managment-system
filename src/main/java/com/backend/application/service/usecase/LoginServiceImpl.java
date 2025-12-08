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
        // 1. Autenticar (si falla, lanza BadCredentialsException automáticamente)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        // 2. Extraer UserDetails
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 3. Generar JWT
        String token = jwtService.generateToken(userDetails);

        // 4. Obtener usuario desde BD
        User user = userRepositoryPort.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        // 5. Actualizar lastLoginAt
        user.recordLogin();
        userRepositoryPort.save(user);

        // 6. Crear UserInfoDto
        UserInfoDto userInfo = new UserInfoDto(
                user.getId(),
                user.getEmail().value(),
                user.getName(),
                user.getRole().name(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );

        return new LoginResponseDto(token, userInfo);
    }
}

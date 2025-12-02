package com.backend.application.service.usecase;

import com.backend.application.port.in.LoginUseCase;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.User;
import com.backend.security.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.springframework.security.core.userdetails.User.withUsername;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginUseCase {

    private final JwtService jwtService;

    private final UserRepositoryPort userRepository;

    private final PasswordEncoder passwordEncoder;


    @Override
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidEmailException("Invalid email or password");
        }

        UserDetails userDetails = withUsername(user.getEmail().value())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        return jwtService.generateToken(userDetails);

    }
}

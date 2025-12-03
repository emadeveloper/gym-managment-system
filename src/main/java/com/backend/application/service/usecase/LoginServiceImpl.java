package com.backend.application.service.usecase;

import com.backend.application.port.in.LoginUseCase;
import com.backend.domain.exception.InvalidCredentialsException;
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

    @Override
    public String login(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            return jwtService.generateToken(userDetails);
        } catch (AuthenticationException e){
            throw new InvalidCredentialsException("Invalid email or password");
        }

    }
}

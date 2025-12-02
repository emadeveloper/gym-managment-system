package com.backend.security.config;

import com.backend.security.filter.JwtAuthenticationFilter;
import com.backend.security.jwt.CustomAuthenticationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomAuthenticationProvider customAuthProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }

    @Bean
    AuthenticationManager authManager (HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.authenticationProvider(customAuthProvider);
        return authBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Permit all requests to auth endpoints
                        .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**", "/h2/console/**")
                        .permitAll()
                        // All other requests need to be authenticated
                        .anyRequest()
                        .authenticated()
                )
                .authenticationManager(authManager(http))
                // Add JWT filter before the email-password authentication filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Set the authentication provider to validate user credentials
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}

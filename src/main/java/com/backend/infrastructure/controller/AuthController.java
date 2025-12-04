package com.backend.infrastructure.controller;

import com.backend.application.port.in.LoginUseCase;
import com.backend.application.port.in.RegisterUserUseCase;
import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.infrastructure.adapter.dto.LoginRequestDto;
import com.backend.infrastructure.adapter.dto.LoginResponseDto;
import com.backend.presentation.dto.RegisterUserRequest;
import com.backend.application.dto.RegisterResponseDto;
import com.backend.presentation.mapper.UserPresentationMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication", description = "Login endpoint for user authentication")
@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegisterUserUseCase registerUserUseCase;
    private final UserPresentationMapper mapper;

    @Operation(
            summary = "Register a new user",
            description = """
                    Creates a new user in the system.
                    Validates email format, checks for duplicates 
                    and stores the user securely.
                    """,
            operationId = "registerUser",
            tags = {"Users"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User successfully registered"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "User with provided email already exists"),
            @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> registerUser(
            @Valid @RequestBody RegisterUserRequest request) {
        // Convert DTO to Command for the use case
        RegisterUserCommand command = mapper.toCommand(request);
        // Execute the use case
        RegisterResponseDto response = registerUserUseCase.registerUser(command);
        // Map the domain to DTO from response
        // Return HTTP Status Code Response
        return ResponseEntity.status(201).body(response);
    }

    @Operation(
            summary = "User Login",
            description = "Authenticates a user and returns a JWT token upon successful login.",
            operationId = "loginUser",
            tags = {"Authentication"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully logged in"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid email or password"),
            @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid
            @RequestBody LoginRequestDto request) {

        LoginResponseDto response = loginUseCase.login(
                request.email(),
                request.password()
        );

        return ResponseEntity.ok(response);
    }
}

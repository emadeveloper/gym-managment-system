package com.backend.infrastructure.controller;

import com.backend.application.port.in.LoginUseCase;
import com.backend.infrastructure.adapter.dto.LoginRequestDto;
import com.backend.infrastructure.adapter.dto.LoginResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication", description = "Login endpoint for user authentication")
@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;

    @Operation(
            summary = "User Login",
            description = "Authenticates a user and returns a JWT token upon successful login.",
            operationId = "loginUser",
            tags = {"Authentication"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully logged in"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - invalid email or password"),
            @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {

        String token = loginUseCase.login(request.email(), request.password());

        return ResponseEntity.ok(new LoginResponseDto(token));
    }
}

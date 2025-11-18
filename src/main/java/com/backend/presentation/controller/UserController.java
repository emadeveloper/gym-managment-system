package com.backend.presentation.controller;

import com.backend.application.port.in.*;
import com.backend.application.port.in.command.DeleteUserCommand;
import com.backend.application.port.in.command.RegisterUserCommand;

// TODO: This should not be from the domain, it really comes from a DTO from the application. Adjust Later
import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.domain.model.User;

import com.backend.presentation.dto.RegisterUserRequest;
import com.backend.presentation.dto.UpdateUserRequest;
import com.backend.presentation.dto.UserResponse;
import com.backend.presentation.mapper.UserPresentationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/users")
public class UserController {

    private final UserPresentationMapper mapper;

    private final RegisterUserUseCase registerUserUseCase;
    private final GetUserByIdUseCase getUserById;
    private final GetAllUsersUseCase getAllUsersUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterUserRequest request) {
        // Convert DTO to Command for the use case
        RegisterUserCommand command = mapper.toCommand(request);
        // Execute the use case
        User user = registerUserUseCase.registerUser(command);
        // Map the domain to DTO from response
        UserResponse response = mapper.toResponse(user);
        // Return HTTP Status Code Response
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        User user = getUserById.getUserById(id);

        UserResponse response = mapper.toResponse(user);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = getAllUsersUseCase.getAllUsers();

        List<UserResponse> response = users.stream()
                .map(mapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest request) {

        // Convert request + id to Update user command
        UpdateUserCommand command = mapper.toCommand(id, request);

        // Execute the use case
        User updatedUser = updateUserUseCase.updateUser(command);

        // Map domain -> DTO
        UserResponse response = mapper.toResponse(updatedUser);

        // Return the response
        return ResponseEntity.ok(response);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {

        DeleteUserCommand command = new DeleteUserCommand(id);

        deleteUserUseCase.deleteUser(command);

        return ResponseEntity.noContent().build();

    }

}

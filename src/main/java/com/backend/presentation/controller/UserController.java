package com.backend.presentation.controller;

import com.backend.application.port.in.*;
import com.backend.application.port.in.command.DeleteUserCommand;
import com.backend.application.port.in.command.RegisterUserCommand;

import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.domain.model.User;

import com.backend.presentation.dto.RegisterUserRequest;
import com.backend.presentation.dto.UpdateUserRequest;
import com.backend.presentation.dto.UserResponse;
import com.backend.presentation.mapper.UserPresentationMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Users", description = "User management endpoints")
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
    public ResponseEntity<UserResponse> registerUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User registration data",
                    required = true
            )
            @RequestBody RegisterUserRequest request) {
        // Convert DTO to Command for the use case
        RegisterUserCommand command = mapper.toCommand(request);
        // Execute the use case
        User user = registerUserUseCase.registerUser(command);
        // Map the domain to DTO from response
        UserResponse response = mapper.toResponse(user);
        // Return HTTP Status Code Response
        return ResponseEntity.status(201).body(response);
    }

    @Operation(
            summary = "Retrieve all users",
            description = """
                    Retrieves a list of users stored in the system.
                    If no users exist, an empty list is returned.
                    """,
            operationId = "getAllUsers",
            tags = {"Users"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully (empty list if none found.)"),
            @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = getAllUsersUseCase.getAllUsers();

        List<UserResponse> response = users.stream()
                .map(mapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Find user by ID",
            description = """
                    Retrieves a user based on the provided UUID.
                    This endpoint returns essential user information.
                    """,
            operationId = "getUserById",
            tags = {"Users"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found"),
            @ApiResponse(responseCode = "400", description = "Invalid UUID format"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @Parameter(description = "UUID of the user to retrieve", required = true)
            @PathVariable UUID id) {

        User user = getUserById.getUserById(id);

        UserResponse response = mapper.toResponse(user);

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Update a user by ID",
            description = """
                    Update email, password, or name for an existing user.
                    """,
            operationId = "updateUserById",
            tags = {"Users"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated"),
            @ApiResponse(responseCode = "400", description = "Invalid request format"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "409", description = "Error updating, email already exists "),
            @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @Parameter(description = "UUID of the user to update")
            @PathVariable UUID id,
            @RequestBody UpdateUserRequest request) {

        // Convert request + id to Update user command
        UpdateUserCommand command = mapper.toCommand(id, request);

        // Execute the use case
        User updatedUser = updateUserUseCase.updateUser(command);

        // Map domain -> DTO
        UserResponse response = mapper.toResponse(updatedUser);

        // Return the response
        return ResponseEntity.ok(response);

    }

    @Operation(
            summary = """
                    Delete a user by ID.
                    """,
            description = "Deletes user and returns no content",
            operationId = "deleteUser",
            tags = {"Users"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User deleted"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {

        DeleteUserCommand command = new DeleteUserCommand(id);

        deleteUserUseCase.deleteUser(command);

        return ResponseEntity.noContent().build();
    }

}

package com.backend.presentation.mapper;

import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.domain.model.User;
import com.backend.presentation.dto.RegisterUserRequest;
import com.backend.presentation.dto.UpdateUserRequest;
import com.backend.presentation.dto.UserResponse;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserPresentationMapper {


    public RegisterUserCommand toCommand(RegisterUserRequest request) {
        return new RegisterUserCommand(
                request.email(),
                request.password()
        );
    }

    public UpdateUserCommand toCommand(UUID id, UpdateUserRequest request) {
        return new UpdateUserCommand(
                id,
                request.email(),
                request.password()
        );
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail().value()
        );
    }
}
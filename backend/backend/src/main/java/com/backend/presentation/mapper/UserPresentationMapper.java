package com.backend.presentation.mapper;

import com.backend.application.port.in.command.RegisterUserCommand;
import com.backend.application.port.in.command.UpdateUserCommand;
import com.backend.domain.model.User;
import com.backend.presentation.dto.RegisterUserRequest;
import com.backend.presentation.dto.UpdateUserRequest;
import com.backend.application.dto.RegisterResponseDto;
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
                request.name(),
                request.lastName(),
                request.dni(),
                request.phone(),
                request.password()
        );
    }

    public RegisterResponseDto toResponse(User user) {
        String displayName = null;
        if (user.getName() != null && !user.getName().isBlank()) {
            displayName = user.getName();
            if (user.getLastName() != null && !user.getLastName().isBlank()) {
                displayName = displayName + " " + user.getLastName();
            }
        }

        return new RegisterResponseDto(
                user.getId(),
                user.getEmail().value(),
                displayName,
                user.getRole().name(),
                null
        );
    }
}

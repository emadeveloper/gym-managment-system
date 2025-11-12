package com.backend.application.usecase;

import com.backend.application.port.in.DeleteUserUseCase;
import com.backend.application.port.in.command.DeleteUserCommand;
import com.backend.application.port.out.UserRepositoryPort;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class DeleteUserServiceImpl implements DeleteUserUseCase {

    private final UserRepositoryPort userRepository;

    @Override
    public void deleteUser(DeleteUserCommand command) {
        userRepository.deleteById(command.id());
    }
}

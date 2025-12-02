package com.backend.application.service.usecase;

import com.backend.application.port.in.GetAllUsersUseCase;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class GetAllUsersServiceImpl implements GetAllUsersUseCase {

    private final UserRepositoryPort userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

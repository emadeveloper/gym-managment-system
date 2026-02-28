package com.backend.application.service.usecase;

import com.backend.application.port.in.UpdatePasswordUseCase;
import com.backend.application.port.in.command.UpdatePasswordCommand;
import com.backend.application.port.out.UserRepositoryPort;
import com.backend.domain.exception.InvalidPasswordException;
import com.backend.domain.exception.UserNotFoundException;
import com.backend.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdatePasswordServiceImpl implements UpdatePasswordUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void execute(UpdatePasswordCommand command) {
        // 1. Get the user from domain
        User user = userRepository.findById(command.userId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // 2. Validate that the old password is correct comparing hashes
        if (!passwordEncoder.matches(command.oldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("The current password is incorrect");
        }

        // 3. Hash the new password BEFORE send it to the domain
        String hashedNewPassword = passwordEncoder.encode(command.newPassword());

        // 4. The domain update the state (and validate length, etc.)
        user.updatePassword(hashedNewPassword);

        // 5. Save changes in the repository
        userRepository.save(user);
    }
}

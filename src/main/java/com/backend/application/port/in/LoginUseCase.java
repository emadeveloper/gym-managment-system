package com.backend.application.port.in;

import com.backend.infrastructure.adapter.dto.LoginResponseDto;

public interface LoginUseCase {
    LoginResponseDto login(String email, String password);
}

package com.backend.infrastructure.adapter.dto;

import com.backend.presentation.dto.UserInfoDto;

public record LoginResponseDto (
        String token,
        UserInfoDto user
){}

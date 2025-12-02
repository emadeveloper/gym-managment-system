package com.backend.infrastructure.adapter.dto;

public record LoginRequestDto (
        String email,
        String password
){}

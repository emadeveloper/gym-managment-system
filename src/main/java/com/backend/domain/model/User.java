package com.backend.domain.model;

import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final UUID id;
    private String name;
    private Email email;
    private String password;
    private Role role;
}

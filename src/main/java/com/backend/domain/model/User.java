package com.backend.domain.model;

import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.InvalidPasswordException;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class User {

    private final UUID id;
    private String name;
    private Email email;
    private String password;
    private Role role;

    // Timestamps
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastLoginAt;
    private Boolean isActive;


    // Constructor used to create a new user with Command
    public User(Email email, String password, Role role) {
        if (email == null) throw new InvalidEmailException("Email cannot be null");
        if (password == null) throw new InvalidPasswordException("Password cannot be null");

        this.id = UUID.randomUUID();
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.isActive = true;
    }

    // Constructor used to create a new user when it doesn't exist on the DB
    public User(UUID id, Email email, String password, Role role,
                Instant createdAt, Instant updatedAt, Instant lastLoginAt, Boolean isActive) {
        if (id == null) throw new IllegalArgumentException("Id cannot be null");
        if (email == null) throw new InvalidEmailException("Email cannot be null");
        if (password == null) throw new InvalidPasswordException("Password cannot be null");

        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLoginAt = lastLoginAt;
        this.isActive = isActive != null ? isActive : true;
    }

    public void updateEmail(Email email) {
        this.email = email;
        this.updatedAt = Instant.now();
    }

    public void updatePassword(String password) {
        this.password = password;
        this.updatedAt = Instant.now();
    }

    public void recordLogin() {
        this.lastLoginAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public void deactivate() {
        this.isActive = false;
        this.updatedAt = Instant.now();
    }

    public void activate() {
        this.isActive = true;
        this.updatedAt = Instant.now();
    }
}

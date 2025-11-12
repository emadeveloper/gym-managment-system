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


    // Constructor used to register a new user with Command
    public User(Email email, String password, Role role) {
        this.id = UUID.randomUUID(); // optional: generated from the domain
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public void updateEmail(Email email) {
        this.email = email;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateRole(Role role) {
        this.role = role;
    }
}

package com.backend.domain.model;

import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.InvalidPasswordException;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import lombok.Data;

import java.util.UUID;

@Data
public class User {

    private final UUID id;
    private String name;
    private Email email;
    private String password;
    private Role role;

    // Constructor used to create a new user with Command
    public User(UUID id, Email email, String password, Role role) {
        if (id == null) throw new IllegalArgumentException("Id cannot be null");
        if (email == null) throw new InvalidEmailException("Email cannot be null");
        if (password == null) throw new InvalidPasswordException("Password cannot be null");

        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Constructor used to create a new user when it doesn't exist on the DB
    public User(Email email, String password, Role role) {
        if (email == null) {throw new InvalidEmailException("Email cannot be null");}
        if (password == null) {throw new InvalidPasswordException("Password cannot be null");}

        this.id = UUID.randomUUID();
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

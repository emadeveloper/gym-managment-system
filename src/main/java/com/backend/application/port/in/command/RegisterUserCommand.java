package com.backend.application.port.in.command;

import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;

public record RegisterUserCommand (Email email, String password, Role role){}
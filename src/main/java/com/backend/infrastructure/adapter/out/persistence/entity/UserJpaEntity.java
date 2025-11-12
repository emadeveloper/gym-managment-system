package com.backend.infrastructure.adapter.out.persistence.entity;

import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.UUID;

@Table(name = "users")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserJpaEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private Email email;
    private String password;
    private Role role;
}

package com.backend.infrastructure.adapter.out.persistence.entity;

import com.backend.domain.valueobject.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_role", columnList = "role"),
        @Index(name = "idx_is_active", columnList = "is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserJpaEntity {

    @Id
    private UUID id;

    // ============ PERSONAL DATA ============
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "last_name")
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ============ BIOMETRIC DATA ============
    @Column(name = "age")
    private Integer age;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    // ============ CONTACT DATA ============
    @Column(name = "dni", unique = true)
    private String dni;

    @Column(name = "phone")
    private String phone;

    // ============ RELATIONS (Foreign Keys) ============
    /**
     * Current Subscription ID
     * Relation 1:1 with subscription table (not implemented yet)
     */
    @Column(name = "current_subscription_id")
    private UUID currentSubscriptionId;

    /**
     * Relation Many-to-Many with trainers (self-referential)
     * A user can have multiple trainers and a trainer can have multiple users
     */
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    @JoinTable(
            name = "user_trainers",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "trainer_id", referencedColumnName = "id")
    )
    private List<UserJpaEntity> trainers = new ArrayList<>();

    // ============ TIMESTAMPS ============
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    // ============ ESTADO ============
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "profile_updated", nullable = false)
    private Boolean profileUpdated = false;
}
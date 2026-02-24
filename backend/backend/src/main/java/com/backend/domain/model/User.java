package com.backend.domain.model;

import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.InvalidPasswordException;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import lombok.Getter;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * User Aggregate Root
 *
 * Representa un usuario de la aplicación La Resistencia.
 * Contiene lógica de validación y comportamiento de dominio.
 */
@Getter
@ToString
@EqualsAndHashCode(of = "id")
public class User {

    // ============ IDENTIDAD ============
    private final UUID id;

    // ============ DATOS PERSONALES ============
    private String name;
    private String lastName;
    private Email email;
    private String password;
    private Role role;

    // ============ DATOS BIOMÉTRICOS ============
    private Integer age;
    private Integer heightCm;
    private BigDecimal weightKg;

    // ============ DATOS DE CONTACTO ============
    private String dni;
    private String phone;

    // ============ RELACIONES (solo IDs en dominio) ============
    private UUID currentSubscriptionId;

    /**
     * IDs de los entrenadores asignados
     * Nota: Los entrenadores se gestionan por relación en BD
     */
    private List<UUID> trainerIds;

    // ============ TIMESTAMPS ============
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastLoginAt;

    // ============ ESTADO ============
    private Boolean isActive;
    private Boolean profileUpdated;

    // ============ CONSTRUCTORES ============

    /**
     * Constructor para crear nuevo usuario (comando de registro)
     * Se llama cuando un usuario se registra por primera vez
     */
    public User(Email email, String password, Role role) {
        if (email == null) throw new InvalidEmailException("Email cannot be null");
        if (password == null) throw new InvalidPasswordException("Password cannot be null");
        if (role == null) throw new IllegalArgumentException("Role cannot be null");

        this.id = UUID.randomUUID();
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.isActive = true;
        this.profileUpdated = false;
        this.trainerIds = new ArrayList<>();
    }

    /**
     * Constructor para recrear usuario desde BD
     * Se llama cuando se obtiene un usuario de la base de datos
     */
    public User(UUID id, String name, String lastName, Email email, String password,
                Role role, Integer age, Integer heightCm, BigDecimal weightKg,
                String dni, String phone, UUID currentSubscriptionId, List<UUID> trainerIds,
                Instant createdAt, Instant updatedAt, Instant lastLoginAt,
                Boolean isActive, Boolean profileUpdated) {

        if (id == null) throw new IllegalArgumentException("Id cannot be null");
        if (email == null) throw new InvalidEmailException("Email cannot be null");
        if (password == null) throw new InvalidPasswordException("Password cannot be null");
        if (role == null) throw new IllegalArgumentException("Role cannot be null");

        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.age = age;
        this.heightCm = heightCm;
        this.weightKg = weightKg;
        this.dni = dni;
        this.phone = phone;
        this.currentSubscriptionId = currentSubscriptionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLoginAt = lastLoginAt;
        this.isActive = isActive != null ? isActive : true;
        this.profileUpdated = profileUpdated != null ? profileUpdated : false;
        // Inicializar trainerIds: si viene null, crear lista vacía
        this.trainerIds = trainerIds != null ? trainerIds : new ArrayList<>();
    }

    // ============ MÉTODOS DE COMPORTAMIENTO ============

    /**
     * Actualizar email con validación
     */
    public void updateEmail(Email email) {
        if (email == null) throw new InvalidEmailException("Email cannot be null");
        this.email = email;
        this.updatedAt = Instant.now();
    }

    /**
     * Actualizar contraseña
     */
    public void updatePassword(String password) {
        if (password == null) throw new InvalidPasswordException("Password cannot be null");
        if (password.length() < 6) throw new InvalidPasswordException("Password must be at least 6 characters");
        this.password = password;
        this.updatedAt = Instant.now();
    }

    /**
     * Actualizar datos personales
     */
    public void updatePersonalData(String name, String lastName, Integer age,
                                   Integer heightCm, BigDecimal weightKg) {
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        this.heightCm = heightCm;
        this.weightKg = weightKg;
        this.profileUpdated = true;
        this.updatedAt = Instant.now();
    }

    /**
     * Actualizar datos de contacto (para MercadoPago, etc)
     */
    public void updateContactData(String dni, String phone) {
        this.dni = dni;
        this.phone = phone;
        this.updatedAt = Instant.now();
    }

    /**
     * Registrar login
     */
    public void recordLogin() {
        this.lastLoginAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    /**
     * Desactivar cuenta
     */
    public void deactivate() {
        if (!this.isActive) {
            throw new IllegalStateException("User is already inactive");
        }
        this.isActive = false;
        this.updatedAt = Instant.now();
    }

    /**
     * Activar cuenta
     */
    public void activate() {
        if (this.isActive) {
            throw new IllegalStateException("User is already active");
        }
        this.isActive = true;
        this.updatedAt = Instant.now();
    }

    /**
     * Asignar entrenador
     */
    public void assignTrainer(UUID trainerId) {
        if (trainerId == null) throw new IllegalArgumentException("Trainer ID cannot be null");
        if (this.trainerIds.contains(trainerId)) {
            throw new IllegalStateException("Trainer already assigned");
        }
        this.trainerIds.add(trainerId);
        this.updatedAt = Instant.now();
    }

    /**
     * Desasignar entrenador
     */
    public void removeTrainer(UUID trainerId) {
        if (!this.trainerIds.contains(trainerId)) {
            throw new IllegalStateException("Trainer not assigned");
        }
        this.trainerIds.remove(trainerId);
        this.updatedAt = Instant.now();
    }

    /**
     * Actualizar suscripción
     */
    public void updateSubscription(UUID subscriptionId) {
        this.currentSubscriptionId = subscriptionId;
        this.updatedAt = Instant.now();
    }

    /**
     * Validar que el usuario está activo
     */
    public boolean isActiveUser() {
        return this.isActive;
    }

    /**
     * Validar que tiene perfil completo
     */
    public boolean hasCompleteProfile() {
        return this.profileUpdated
                && this.name != null
                && this.lastName != null
                && this.age != null
                && this.heightCm != null
                && this.weightKg != null;
    }
}
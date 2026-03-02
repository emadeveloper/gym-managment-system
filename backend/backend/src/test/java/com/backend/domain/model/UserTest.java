package com.backend.domain.model;

import com.backend.domain.exception.InvalidPasswordException;
import com.backend.domain.valueobject.Email;
import com.backend.domain.valueobject.Role;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserTest {

    @Test
    void validateRawPasswordShouldRejectShortPasswords() {
        assertThrows(InvalidPasswordException.class, () -> User.validateRawPassword("123"));
        assertDoesNotThrow(() -> User.validateRawPassword("123456"));
    }

    @Test
    void shouldDefensivelyCopyTrainerIds() {
        UUID trainerId = UUID.randomUUID();
        List<UUID> trainerIds = new ArrayList<>(List.of(trainerId));

        User user = new User(
                UUID.randomUUID(),
                "John",
                "Doe",
                new Email("john@example.com"),
                "encodedPassword",
                Role.USER,
                30,
                180,
                BigDecimal.valueOf(80),
                "12345678",
                "5551234",
                null,
                trainerIds,
                Instant.now(),
                Instant.now(),
                null,
                true,
                true
        );

        trainerIds.clear();

        assertEquals(1, user.getTrainerIds().size());
        assertThrows(UnsupportedOperationException.class,
                () -> user.getTrainerIds().add(UUID.randomUUID()));
    }

    @Test
    void shouldRejectInvalidBiometricData() {
        User user = new User(new Email("john@example.com"), "encodedPassword", Role.USER);

        assertThrows(IllegalArgumentException.class, () ->
                user.updatePersonalData("John", "Doe", 0, 180, BigDecimal.valueOf(80)));
    }
}

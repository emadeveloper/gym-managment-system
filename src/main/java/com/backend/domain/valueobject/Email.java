package com.backend.domain.valueobject;

import java.util.Objects;
import java.util.regex.Pattern;


public record Email(String value) {
    private static final Pattern EMAIL_REGEX = Pattern.compile("^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");

    public Email {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        value = value.toLowerCase().trim();

        if (!EMAIL_REGEX.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid email format: " + value);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email email)) return false;

        return value.equals(email.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value;
    }
}

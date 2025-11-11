package com.backend.domain.valueobject;

import java.util.Objects;
import java.util.regex.Pattern;

public class Email {
    private final String value;
    private static final Pattern EMAIL_REGEX = Pattern.compile("^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");

    public Email (String value) {
        if (value == null || !EMAIL_REGEX.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email email)) return false;

        return value.equalsIgnoreCase(email.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value.toLowerCase());
    }

    @Override
    public String toString() {
        return value;
    }


}

package com.eduflow.util;

public final class DatabaseConfig {

    private DatabaseConfig() {
    }

    public static String url() {
        return required("DB_URL");
    }

    public static String user() {
        return required("DB_USER");
    }

    public static String password() {
        return required("DB_PASSWORD");
    }

    private static String required(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(name + " environment variable is required");
        }
        return value;
    }
}

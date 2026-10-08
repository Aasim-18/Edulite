package com.eduflow.servlet;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

final class DatabaseConnection {

    private DatabaseConnection() {
    }

    static Connection open() throws SQLException {
        return DriverManager.getConnection(
                required("DB_URL"),
                required("DB_USER"),
                required("DB_PASSWORD")
        );
    }

    private static String required(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(name + " environment variable is required");
        }
        return value;
    }
}

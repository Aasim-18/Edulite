package com.eduflow.exception;

public class SchoolClassNotFoundException extends RuntimeException {
    public SchoolClassNotFoundException(String message) {
        super(message);
    }
}
package com.eduflow.exception;

public class MaterialAccessDeniedException extends RuntimeException {
    public MaterialAccessDeniedException(String message) {
        super(message);
    }
}
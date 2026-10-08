package com.eduflow.model;

public record Student(
        long id,
        String name,
        String email,
        String className,
        String rollNumber
) {
}

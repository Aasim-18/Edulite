package com.eduflow.exception;

public class InvalidNoticeException extends RuntimeException {
    public InvalidNoticeException(String message) {
        super(message);
    }
}
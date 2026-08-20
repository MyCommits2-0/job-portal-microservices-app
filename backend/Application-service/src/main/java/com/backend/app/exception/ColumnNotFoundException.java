package com.backend.app.exception;

public class ColumnNotFoundException extends RuntimeException {

    public ColumnNotFoundException(String message) {
        super(message);
    }
}

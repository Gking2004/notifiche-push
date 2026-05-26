package com.r2u.notification.exception;

public class UserNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
    
    public static UserNotFoundException create() {
        return new UserNotFoundException("User not found");
    }

    public static UserNotFoundException create(Long id) {
        return new UserNotFoundException("User not found with id: " + id);
    }

    public static UserNotFoundException createByUsername(String username) {
        return new UserNotFoundException("User not found with username: " + username);
    }

    public static UserNotFoundException createByEmail(String email) {
        return new UserNotFoundException("User not found with email: " + email);
    }
}

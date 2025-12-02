package com.archipellibre.model;

public enum UserRole {
    USER,
    MODERATOR,
    ADMIN;

    /**
     * Check if this role has a specific permission
     */
    public boolean hasPermission(String permission) {
        return switch (this) {
            case ADMIN -> true;
            case MODERATOR -> !permission.equals("DELETE_USER") && !permission.equals("MANAGE_ADMINS");
            case USER -> permission.equals("VIEW_PROFILE") || permission.equals("CREATE_CONTENT");
        };
    }

    /**
     * Check if this role can moderate content
     */
    public boolean canModerate() {
        return this == MODERATOR || this == ADMIN;
    }

    /**
     * Check if this role is elevated (not regular user)
     */
    public boolean isElevated() {
        return this == MODERATOR || this == ADMIN;
    }
}


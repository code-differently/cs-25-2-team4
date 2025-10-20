package com.smarthome.backend.enums;

public enum Permission {
        READ("read"),
        WRITE("write"),
        ADMIN("admin");

        private final String value;

        Permission(String value) {
                this.value = value;
        }

        public String getValue() {
                return value;
        }

        // Helper method to get enum from string value
        public static Permission fromValue(String value) {
                for (Permission permission : Permission.values()) {
                        if (permission.value.equals(value)) {
                                return permission;
                        }
                }
                throw new IllegalArgumentException("Unknown permission: " + value);
        }
}

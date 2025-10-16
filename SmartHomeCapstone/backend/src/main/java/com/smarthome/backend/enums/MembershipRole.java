package com.smarthome.backend.enums;

public enum MembershipRole {
    ADMIN("admin"),
    MEMBER("member");    
    private final String value;
    
    MembershipRole(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    // Helper method to get enum from string value
    public static MembershipRole fromValue(String value) {
        for (MembershipRole role : MembershipRole.values()) {
            if (role.value.equals(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown role: " + value);
    }
}
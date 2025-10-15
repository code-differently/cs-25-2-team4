package com.smarthome.backend.enums;

public enum DeviceStatus {
    ON("on"),
    OFF("off"),
    ERROR("error");
    
    private final String value;
    
    DeviceStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    // Helper method to get enum from string value
    public static DeviceStatus fromValue(String value) {
        for (DeviceStatus status : DeviceStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown device status: " + value);
    }
}
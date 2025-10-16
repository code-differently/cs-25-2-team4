package com.smarthome.backend.enums;

public enum ThermostatMode {
        HEAT("heat"),
        COOL("cool"),
        AUTO("auto"),
        OFF("off");

        private final String value;

        ThermostatMode(String value) {
                this.value = value;
        }

        public String getValue() {
                return value;
        }

        // Helper method to get enum from string value
        public static ThermostatMode fromValue(String value) {
                for (ThermostatMode mode : ThermostatMode.values()) {
                        if (mode.value.equals(value)) {
                                return mode;
                        }
                }
                throw new IllegalArgumentException("Unknown thermostat mode: " + value);
        }
}

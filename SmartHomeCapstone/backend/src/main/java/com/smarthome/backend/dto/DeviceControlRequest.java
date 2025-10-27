package com.smarthome.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class DeviceControlRequest {

        @NotBlank(message = "Action is required")
        private String action; // "turn_on", "turn_off", "set_brightness", "set_temperature", etc.

        private Object value; // The value for the action (brightness level, temperature, etc.)

        // Constructors
        public DeviceControlRequest() {}

        public DeviceControlRequest(String action, Object value) {
                this.action = action;
                this.value = value;
        }

        public String getAction() {
                return action;
        }

        public void setAction(String action) {
                this.action = action;
        }

        public Object getValue() {
                return value;
        }

        public void setValue(Object value) {
                this.value = value;
        }

        @Override
        public String toString() {
                return "DeviceControlRequest{"
                                + "action='"
                                + action
                                + '\''
                                + ", value="
                                + value
                                + ", valueType="
                                + (value != null ? value.getClass().getName() : "null")
                                + '}';
        }
}

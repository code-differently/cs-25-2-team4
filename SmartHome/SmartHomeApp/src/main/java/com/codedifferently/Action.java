package com.codedifferently;

public class Action {
    private String deviceId;
    private String command;
    private String value; // Optional: for commands like "setBrightness"

    public Action(String deviceId, String command, String value) {
        this.deviceId = deviceId;
        this.command = command;
        this.value = value;
    }

    public Action(String deviceId, String command) {
        this(deviceId, command, null);
    }

    // Getters for all fields
    public String getDeviceId() {
        return deviceId;
    }

    public String getCommand() {
        return command;
    }

    public String getValue() {
        return value;
    }
}
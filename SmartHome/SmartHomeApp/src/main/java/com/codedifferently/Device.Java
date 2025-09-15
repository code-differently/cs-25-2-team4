package com.smarthome.app;

public abstract class Device {
    private String deviceId;
    private String deviceName;
    private String room;
    private boolean isLinked;

    public Device(String deviceId, String deviceName, String room) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.room = room;
        this.isLinked = false;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    // Getters
    public String getDeviceId() {
        return deviceId;
    }

    public String getRoom() {
        return room;
    }

    public boolean isLinked() {
        return isLinked;
    }

    public void setLinked(boolean linked) {
        isLinked = linked;
    }

    public abstract String getStatus();

    // All devices must be able to be turned on or off
    // Even if a thermostat doesn't technically "turn on," its power state can be controlled
    public abstract void turnOn();
    public abstract void turnOff();

}

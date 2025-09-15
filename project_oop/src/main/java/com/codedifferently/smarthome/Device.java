package com.codedifferently.smarthome;

import java.util.Objects;

public abstract class Device {
    private final String deviceId;
    private String room;

    protected Device(String deviceId, String room) {
        if (deviceId == null || deviceId.isBlank()) throw new IllegalArgumentException("deviceId");
        if (room == null || room.isBlank()) throw new IllegalArgumentException("room");
        this.deviceId = deviceId;
        this.room = room;
    }

    public String getDeviceId() { return deviceId; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public abstract String getStatus();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Device)) return false;
        Device device = (Device) o;
        return deviceId.equals(device.deviceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deviceId);
    }
}

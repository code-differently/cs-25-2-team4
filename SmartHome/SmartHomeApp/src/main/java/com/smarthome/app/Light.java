package com.smarthome.app;

public class Light implements SwitchableDevice {
    private final String deviceId;
    private String room;
    private boolean isOn;
    private int brightness; // 0-100

    public Light(String deviceId, String room) {
        this.deviceId = deviceId;
        this.room = room;
        this.isOn = false;
        this.brightness = 100;
    }

    @Override
    public String getDeviceId() {
        return deviceId;
    }

    @Override
    public String getDeviceName() {
        // Use deviceId as the display/name for now.
        return deviceId;
    }

    @Override
    public String getRoom() {
        return room;
    }

    @Override
    public void setRoom(String room) {
        this.room = room;
    }

    @Override
    public void turnOn() {
        isOn = true;
    }

    @Override
    public void turnOff() {
        isOn = false;
    }

    @Override
    public boolean isOn() {
        return isOn;
    }

    public int getBrightness() {
        return brightness;
    }

    public void setBrightness(int brightness) {
        this.brightness = Math.max(0, Math.min(100, brightness));
    }

    @Override
    public String toString() {
        return "Light ID: " + getDeviceId()
                + ", Room: " + getRoom()
                + ", Status: " + (isOn ? "ON" : "OFF")
                + ", Brightness: " + this.brightness;
    }
}

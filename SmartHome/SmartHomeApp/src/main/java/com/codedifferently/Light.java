package com.smarthome.app;

public class Light extends Device implements SwitchableDevice {
    private boolean isOn;
    private int brightness;

    public Light(String deviceId, String room) {
        super(deviceId, room);
        this.isOn = false;
        this.brightness = 0;
    }

    @Override
    public void turnOn() {
        this.isOn = true;
        this.brightness = 50; // A default brightness when turned on
        System.out.println("Light " + getDeviceId() + " is now ON.");
    }

    @Override
    public void turnOff() {
        this.isOn = false;
        this.brightness = 0;
        System.out.println("Light " + getDeviceId() + " is now OFF.");
    }

    @Override
    public boolean isOn() {
        return this.isOn;
    }

    @Override
    public String getStatus() {
        return "Light ID: " + getDeviceId() + ", Room: " + getRoom() + ", Status: " + (isOn ? "ON" : "OFF") + ", Brightness: " + this.brightness;
    }

    // A unique method for the Light class
    public void setBrightness(int brightness) {
        if (this.isOn) {
            this.brightness = brightness;
            System.out.println("Light " + getDeviceId() + " brightness set to " + brightness + ".");
        } else {
            System.out.println("Cannot set brightness. Light is off.");
        }
    }
}
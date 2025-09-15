package com.smarthome.app;

public abstract class Device {
    // This is the blueprint for all smart home devices.
}
package com.smarthome.app;

public class Light extends Device {
    private boolean isOn;
    private int brightness; // Brightness level from 0 to 100

    public Light(String deviceId, String room) {
        super(deviceId, room);
        this.isOn = false;
        this.brightness = 0;
    }

    @Override
    public String getStatus() {
        String status = "OFF";
        if (isOn) {
            status = "ON";
        }
        return "Light ID: " + getDeviceId() + ", Room: " + getRoom() + ", Status: " + status;
    }

    @Override
    public void turnOn() {
        this.isOn = true;
        this.setLinked(true); 
        this.brightness = 50;
    }

    @Override
    public void turnOff() {
        this.isOn = false;
        this.brightness = 0;
    }

    // This is a unique method for a Light, not required by the parent class
    public void setBrightness(int brightness) {
        this.brightness = brightness;
    }

    public abstract class Device {
    // ... (properties and constructor)

    // All devices must be able to report their status
    public abstract String getStatus();

    // All devices must be able to be turned on or off
    // Even if a thermostat doesn't technically "turn on," its power state can be controlled
    public abstract void turnOn();
    public abstract void turnOff();
}
}
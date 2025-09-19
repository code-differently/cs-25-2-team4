package com.smarthome.devices;

public class SecurityCamera extends Device implements SwitchableDevice {
    private boolean isRecording;

    public SecurityCamera(String deviceId, String deviceName) {
        super(deviceId, deviceName);
        this.isRecording = false; // default status
    }

    public void startRecording() {
        isRecording = true;
    }

    public void stopRecording() {
        isRecording = false;
    }

    public boolean isRecording() {
        return isRecording;
    }

    @Override
    public void turnOn() {
        startRecording();
    }

    @Override
    public boolean isOn() {
        return isRecording;
    }

    @Override
    public void turnOff() {
        stopRecording();
    }

    @Override
    public String getStatus() {
        return String.format("Camera ID: %s, Name: %s, Recording: %s",
                getDeviceId(), getDeviceName(), isRecording ? "Yes" : "No");
    }
    
}

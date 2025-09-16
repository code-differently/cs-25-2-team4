package com.codedifferently;

public abstract class Device {
    protected String deviceId;
    protected String deviceName;

    public Device() {}

    public Device(String deviceId, String deviceName) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
    }

    public String getDeviceId() { return deviceId; }
    public String getDeviceName() { return deviceName; }
}

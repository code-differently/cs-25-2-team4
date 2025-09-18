package com.smarthome.devices;

public abstract class Device {
  private String deviceId;
  private String deviceName;
  private boolean isLinked;

  public Device(String deviceId, String deviceName) {
    this.deviceId = deviceId;
    this.deviceName = deviceName;
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

  public boolean isLinked() {
    return isLinked;
  }

  public void setLinked(boolean linked) {
    isLinked = linked;
  }

  public abstract String getStatus();
}

package com.smarthome.devices;

public class Thermostat extends Device implements SwitchableDevice {
  private double temperature;
  private boolean isOn;

  public Thermostat(String deviceId, String deviceName) {
    super(deviceId, deviceName);
    this.temperature = 20.0; // default temperature
    this.isOn = false; // default status
  }

  public double getTemp() {
    return temperature;
  }

  public void setTemp(double temperature) {
    this.temperature = temperature;
  }

  @Override
  public void turnOn() {
    isOn = true;
  }

  @Override
  public boolean isOn() {
    return isOn;
  }

  @Override
  public void turnOff() {
    isOn = false;
  }

  @Override
  public String getStatus() {
    return String.format(
        "Thermostat ID: %s, Name: %s, Temperature: %.1f°C",
        getDeviceId(), getDeviceName(), temperature);
  }
}

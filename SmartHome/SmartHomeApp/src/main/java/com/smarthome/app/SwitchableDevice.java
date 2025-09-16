package com.smarthome.app;

public interface SwitchableDevice extends Device {
  void turnOn();

  void turnOff();

  boolean isOn();
}

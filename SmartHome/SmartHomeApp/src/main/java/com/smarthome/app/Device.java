package com.smarthome.app;

public interface Device {
  String getDeviceId();

  String getDeviceName(); // <-- needed by HomeManager

  String getRoom();

  void setRoom(String room);
}

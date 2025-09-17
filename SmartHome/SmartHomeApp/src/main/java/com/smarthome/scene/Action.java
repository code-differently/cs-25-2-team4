package com.smarthome.scene;

public class Action {
  private final String deviceId;
  private final String command;
  private final String value;

  public Action(String deviceId, String command) {
    this.deviceId = deviceId;
    this.command = command;
    this.value = null;
  }

  public Action(String deviceId, String command, String value) {
    this.deviceId = deviceId;
    this.command = command;
    this.value = value;
  }

  public String getDeviceId() {
    return deviceId;
  }

  public String getCommand() {
    return command;
  }

  public String getValue() {
    return value;
  }
}

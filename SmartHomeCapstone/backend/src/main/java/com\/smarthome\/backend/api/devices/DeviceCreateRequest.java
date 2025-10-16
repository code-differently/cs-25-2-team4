package com.smarthome.backend.api.devices;
public class DeviceCreateRequest {
  private String name;
  private String type;
  public DeviceCreateRequest() {}
  public DeviceCreateRequest(String name, String type) {
    this.name = name; this.type = type;
  }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getType() { return type; }
  public void setType(String type) { this.type = type; }
}

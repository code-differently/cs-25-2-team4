package com.smarthome.app;

import com.smarthome.devices.Device;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class Room {
  private final UUID roomID;
  private final String roomName;
  private final Set<Device> devices = new HashSet<>();

  public Room(String roomName) {
    this.roomID = UUID.randomUUID();
    this.roomName = roomName;
  }

  public UUID getRoomID() {
    return roomID;
  }

  public String getRoomName() {
    return roomName;
  }

  public Set<Device> getDevices() {
    return Collections.unmodifiableSet(devices);
  }

  public boolean addDevice(Device device) {
    return devices.add(device);
  }

  public boolean removeDevice(Device device) {
    return devices.remove(device);
  }

  public void clearDevices() {
    devices.clear();
  }
}

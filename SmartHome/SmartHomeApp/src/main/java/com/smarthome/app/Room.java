package com.smarthome.app;

import com.smarthome.devices.Device;
import com.smarthome.exceptions.DeviceNotFoundException;
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
    device.setLinked(true);
    return devices.add(device);
  }

  public boolean removeDevice(Device device) {
    if (device == null || !devices.contains(device)) {
      throw new DeviceNotFoundException("Device not found in: " + roomName);
    }
    device.setLinked(false);
    return devices.remove(device);
  }

  public void clearDevices() {
    devices.forEach(device -> device.setLinked(false));
    devices.clear();
  }
}

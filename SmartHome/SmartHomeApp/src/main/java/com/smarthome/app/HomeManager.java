package com.smarthome.app;

import com.smarthome.devices.Device;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class HomeManager {
  private final String accountId;
  private final Set<Room> rooms = new HashSet<>();

  public HomeManager(String accountId) {
    this.accountId = accountId;
  }

  public String getAccountId() {
    return accountId;
  }

  public Set<Room> getRooms() {
    return Collections.unmodifiableSet(rooms);
  }

  public boolean addRoom(Room room) {
    return rooms.add(room);
  }

  public boolean deleteRoom(Room room) {
    return rooms.remove(room);
  }

  public Set<Device> getAllDevices() {
    Set<Device> all = new HashSet<>();
    for (Room r : rooms) {
      all.addAll(r.getDevices());
    }
    return Collections.unmodifiableSet(all);
  }

  public boolean addDevice(Device device, Room room) {
    if (rooms.contains(room)) {
      return room.addDevice(device);
    }
    return false;
  }

  public boolean removeDevice(Device device) {
    boolean removed = false;
    for (Room r : rooms) {
      if (r.removeDevice(device)) {
        removed = true;
      }
    }
    return removed;
  }

  public Room getRoombyName(String name) {
    for (Room r : rooms) {
      if (r.getRoomName().equalsIgnoreCase(name)) {
        return r;
      }
    }
    return null;
  }

  public Device getDevicebyName(String name) {
    for (Device d : getAllDevices()) {
      if (d.getDeviceName().equalsIgnoreCase(name)) {
        return d;
      }
    }
    return null;
  }

    public Set<Device> getDevices() {
        return getAllDevices();
    }

      public void sendCommand(Device device, String command, Object value) throws InvalidCommandException {
    if (device == null || !getAllDevices().contains(device)) {
        throw new DeviceNotFoundException("Device not found: " + (device != null ? device.getDeviceId() : "null"));
    }

    try {
        Method method;

        if (value == null) {
            method = device.getClass().getMethod(command);
            method.invoke(device);
        } else {
            method = device.getClass().getMethod(command, value.getClass());
            method.invoke(device, value);
        }

    } catch (NoSuchMethodException e) {
        throw new InvalidCommandException(device.getClass().getSimpleName(), command);
    } catch (Exception e) {
        throw new RuntimeException("Error invoking method", e);
    }
}
}

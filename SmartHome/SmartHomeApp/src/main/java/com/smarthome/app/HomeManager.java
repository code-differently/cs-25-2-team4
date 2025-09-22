package com.smarthome.app;

import com.smarthome.devices.Device;
import com.smarthome.exceptions.DeviceNotFoundException;
import com.smarthome.exceptions.InvalidCommandException;
import com.smarthome.exceptions.RoomNotFoundException;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class HomeManager {
  private final String accountId;
  private final Set<Room> rooms = new HashSet<>();

  private final CommandExecutor commandExecutor = new CommandExecutor();

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

  public boolean deleteRoom(Room room) throws RoomNotFoundException {
    if (room == null || !rooms.contains(room)) {
      throw new RoomNotFoundException(
          "Room not found: " + (room != null ? room.getRoomName() : "null"));
    }
    room.clearDevices();
    rooms.remove(room);
    return true;
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

  public boolean removeDevice(Device device) throws DeviceNotFoundException {
    if (device == null) {
      throw new DeviceNotFoundException("Device cannot be null");
    }

    boolean removed = false;
    for (Room r : rooms) {
      try {
        if (r.removeDevice(device)) {
          removed = true;
        }
      } catch (DeviceNotFoundException e) {
        // Continue to next room if device not found in this room
        continue;
      }
    }

    if (!removed) {
      throw new DeviceNotFoundException("Device not found in any room: " + device.getDeviceName());
    }

    return true; // Always true if we reach here (device was removed successfully)
  }

  public Room getRoombyName(String name) {
    for (Room r : rooms) {
      if (r.getRoomName().equalsIgnoreCase(name)) {
        return r;
      }
    }
    throw new RoomNotFoundException("Room not found: " + name);
  }

  public Device getDevicebyName(String name) {
    for (Device d : getAllDevices()) {
      if (d.getDeviceName().equalsIgnoreCase(name)) {
        return d;
      }
    }
    return null;
  }
  public Device getDeviceById(String id) {
    for (Device d : getAllDevices()) {
      if (d.getDeviceId().equalsIgnoreCase(id)) {
        return d;
      }
    }
    return null;
  }

  public void sendCommand(Device device, String command, Object value)
      throws InvalidCommandException {
    if (device == null || !getAllDevices().contains(device)) {
      throw new DeviceNotFoundException(
          "Device not found: " + (device != null ? device.getDeviceId() : "null"));
    }

    if (value == null) {
      commandExecutor.execute(device, command);
    } else {
      commandExecutor.execute(device, command, value);
    }
  }
}

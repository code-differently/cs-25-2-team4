package com.smarthome.app;

import com.smarthome.exceptions.DeviceNotFoundException;
import com.smarthome.exceptions.InvalidCommandException;

import com.smarthome.devices.Device;

import com.smarthome.exceptions.DeviceNotFoundException;
import com.smarthome.exceptions.InvalidCommandException;
import com.smarthome.exceptions.RoomNotFoundException;


import java.lang.reflect.Method;
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

  public boolean deleteRoom(Room room) throws RoomNotFoundException {
    if (room == null || !rooms.contains(room)) {
      throw new RoomNotFoundException("Room not found: " + (room != null ? room.getRoomName() : "null"));
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

    public Set<Device> getDevices() {
        return getAllDevices();
    }

      public void sendCommand(Device device, String command, Object value) throws InvalidCommandException {
    if (device == null || !getAllDevices().contains(device)) {
        throw new DeviceNotFoundException("Device not found: " + (device != null ? device.getDeviceId() : "null"));
    }

    try {
        Method method = null;

        if (value == null) {
            method = device.getClass().getMethod(command);
            method.invoke(device);
        } else {
            // First try with the exact type
            try {
                method = device.getClass().getMethod(command, value.getClass());
            } catch (NoSuchMethodException e) {
                // If that fails, try with primitive type conversion
                Class<?> primitiveType = getPrimitiveType(value.getClass());
                if (primitiveType != null) {
                    method = device.getClass().getMethod(command, primitiveType);
                }
            }
            
            if (method != null) {
                method.invoke(device, value);
            } else {
                throw new NoSuchMethodException("No suitable method found for: " + command);
            }
        }

    } catch (NoSuchMethodException e) {
      
        throw new InvalidCommandException(device.getClass().getSimpleName(), new Throwable(command));
    } catch (Exception e) {
        throw new RuntimeException("Error invoking method", e);
    }
}

/**
 * Helper method to convert wrapper classes to their primitive equivalents
 */
private Class<?> getPrimitiveType(Class<?> wrapperType) {
    if (wrapperType == Integer.class) return int.class;
    if (wrapperType == Double.class) return double.class;
    if (wrapperType == Float.class) return float.class;
    if (wrapperType == Boolean.class) return boolean.class;
    if (wrapperType == Character.class) return char.class;
    return null;
}
}

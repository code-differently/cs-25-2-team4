package com.smarthome.app;

import com.codedifferently.Device;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class HomeManager {
    private final Set<Room> rooms = new HashSet<>();

    public boolean addRoom(Room room) {
        return room != null && rooms.add(room);
    }

    public boolean deleteRoom(Room room) {
        return room != null && rooms.remove(room);
    }

    public Set<Room> getRooms() {
        return rooms;
    }

    public boolean addDevice(Device device, String roomName) {
        if (device == null || roomName == null) return false;
        Room room = getRoomByName(roomName);
        if (room == null) {
            room = new Room(roomName);
            rooms.add(room);
        }
        room.addDevice(device);
        return true;
    }

    public void removeDevice(Device device) {
        if (device == null) return;
        for (Room room : rooms) {
            room.removeDevice(device);
        }
    }

    // Required: search the Set of Rooms by name
    public Room getRoomByName(String name) {
        if (name == null) return null;
        Optional<Room> match = rooms.stream()
                .filter(r -> r.getRoomName().equalsIgnoreCase(name))
                .findFirst();
        return match.orElse(null);
    }

    // Required: search across all devices by deviceName
    public Device getDeviceByName(String name) {
        if (name == null) return null;
        for (Room room : rooms) {
            for (Device device : room.getDevices()) {
                String deviceName = device.getDeviceName();
                if (deviceName != null && deviceName.equalsIgnoreCase(name)) {
                    return device;
                }
            }
        }
        return null;
    }
}

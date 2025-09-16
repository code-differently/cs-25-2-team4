package com.smarthome.app;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class Room {
    private final String roomName;
    private final Set<Device> devices = new HashSet<>();

    public Room(String roomName) {
        this.roomName = roomName;
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
}

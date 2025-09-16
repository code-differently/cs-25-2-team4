package com.smarthome.app;

import com.codedifferently.Device;
import java.util.HashSet;
import java.util.Set;

public class Room {
    private final String roomName;
    private final Set<Device> devices = new HashSet<>();

    public Room(String roomName) { this.roomName = roomName; }
    public String getRoomName() { return roomName; }
    public Set<Device> getDevices() { return devices; }
    public void addDevice(Device device) { if (device != null) devices.add(device); }
    public void removeDevice(Device device) { devices.remove(device); }
}

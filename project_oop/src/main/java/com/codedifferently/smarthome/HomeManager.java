package com.codedifferently.smarthome;

import java.util.*;

public class HomeManager {
    private final DeviceRegistry registry = new DeviceRegistry();

    public void linkDevice(Device device, String... capabilities) {
        registry.add(device, capabilities == null ? List.of() : Arrays.asList(capabilities));
    }

    public void unlinkDevice(String deviceId) { registry.remove(deviceId); }

    public Device getDevice(String deviceId) { return registry.getById(deviceId); }

    public List<Device> devicesByRoom(String room) { return registry.listByRoom(room); }

    public List<Device> devicesByCapability(String capability) { return registry.listByCapability(capability); }

    public int deviceCount() { return registry.size(); }
}

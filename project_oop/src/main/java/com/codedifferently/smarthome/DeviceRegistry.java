package com.codedifferently.smarthome;

import java.util.*;

public class DeviceRegistry {
    private final Map<String, Device> byId = new HashMap<>();
    private final Map<String, Set<String>> byRoom = new HashMap<>();
    private final Map<String, Set<String>> byCapability = new HashMap<>();

    public void add(Device device, Collection<String> capabilities) {
        if (device == null) throw new IllegalArgumentException("device");
        if (byId.containsKey(device.getDeviceId())) return;
        byId.put(device.getDeviceId(), device);
        byRoom.computeIfAbsent(device.getRoom(), k -> new HashSet<>()).add(device.getDeviceId());
        if (capabilities != null) {
            for (String cap : capabilities) {
                byCapability.computeIfAbsent(cap, k -> new HashSet<>()).add(device.getDeviceId());
            }
        }
    }

    public void remove(String deviceId) {
        Device dev = byId.remove(deviceId);
        if (dev == null) return;
        Set<String> ids = byRoom.get(dev.getRoom());
        if (ids != null) {
            ids.remove(deviceId);
            if (ids.isEmpty()) byRoom.remove(dev.getRoom());
        }
        for (Set<String> idsByCap : byCapability.values()) idsByCap.remove(deviceId);
        byCapability.entrySet().removeIf(e -> e.getValue().isEmpty());
    }

    public Device getById(String deviceId) { return byId.get(deviceId); }

    public List<Device> listByRoom(String room) {
        Set<String> ids = byRoom.getOrDefault(room, Collections.emptySet());
        List<Device> out = new ArrayList<>(ids.size());
        for (String id : ids) out.add(byId.get(id));
        return out;
    }

    public List<Device> listByCapability(String capability) {
        Set<String> ids = byCapability.getOrDefault(capability, Collections.emptySet());
        List<Device> out = new ArrayList<>(ids.size());
        for (String id : ids) out.add(byId.get(id));
        return out;
    }

    public boolean contains(String deviceId) { return byId.containsKey(deviceId); }
    public int size() { return byId.size(); }
}

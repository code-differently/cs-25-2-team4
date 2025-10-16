package com.smarthome.backend.api.devices;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;
@Service
public class DeviceService {
  private final Map<String, Device> store = new ConcurrentHashMap<>();
  private final AtomicLong seq = new AtomicLong(1);
  public List<Device> list() { return new ArrayList<>(store.values()); }
  public Device add(String name, String type) {
    String id = String.valueOf(seq.getAndIncrement());
    Device d = new Device(id, name, type, true);
    store.put(id, d);
    return d;
  }
  public void remove(String id) { store.remove(id); }
}

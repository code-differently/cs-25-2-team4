package com.smarthome.app;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class HomeManagerTest {

  @Test
  void add_and_get_device_by_name() {
    HomeManager hm = new HomeManager();
    Light l = new Light("L10", "Den");
    hm.addDevice(l); // expects HomeManager.addDevice(Device)
    Device found = hm.getDeviceByName("L10"); // expects HomeManager.getDeviceByName(String)
    assertNotNull(found, "Device should be retrievable by name");
    assertEquals("L10", found.getDeviceName());
  }
}

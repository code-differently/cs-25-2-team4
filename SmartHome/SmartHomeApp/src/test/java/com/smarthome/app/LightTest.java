package com.smarthome.app;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class LightTest {

  @Test
  void defaults_areOff_andBrightness100() {
    Light l = new Light("L1", "Living");
    assertEquals("L1", l.getDeviceId());
    assertEquals("L1", l.getDeviceName()); // name == id for now
    assertEquals("Living", l.getRoom());
    assertFalse(l.isOn());
    assertEquals(100, l.getBrightness());
  }

  @Test
  void can_turnOn_turnOff_and_changeRoom() {
    Light l = new Light("L2", "Kitchen");
    l.turnOn();
    assertTrue(l.isOn());
    l.turnOff();
    assertFalse(l.isOn());
    l.setRoom("Hall");
    assertEquals("Hall", l.getRoom());
  }

  @Test
  void brightness_isClamped_0_to_100() {
    Light l = new Light("L3", "Office");
    l.setBrightness(150);
    assertEquals(100, l.getBrightness());
    l.setBrightness(-20);
    assertEquals(0, l.getBrightness());
    l.setBrightness(42);
    assertEquals(42, l.getBrightness());
  }

  @Test
  void toString_contains_key_fields() {
    Light l = new Light("L4", "Bedroom");
    String s = l.toString();
    assertTrue(s.contains("Light ID: L4"));
    assertTrue(s.contains("Room: Bedroom"));
  }
}

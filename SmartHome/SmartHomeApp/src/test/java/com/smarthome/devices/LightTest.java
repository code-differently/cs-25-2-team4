package com.smarthome.devices;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class LightTest {
  private Light light;

  @BeforeEach
  void setUp() {
    light = new Light("L1", "Living Room Light");
  }

  @Test
  void testLightTurnOnOff() {
    light.turnOn();
    assertTrue(light.isOn(), "Light should be on after turnOn()");
    light.turnOff();
    assertFalse(light.isOn(), "Light should be off after turnOff()");
  }

  @Test
  void testSetBrightness() {
    light.turnOn();
    light.setBrightness(75);
    // Since setBrightness doesn't return a value, we test via the status string
    String status = light.getStatus();
    assertTrue(status.contains("Brightness: 75"), "Status should show brightness 75");
  }

  @Test
  void testLightStatus() {
    String status = light.getStatus();
    assertTrue(status.contains("Light ID: L1"), "Status should contain light ID");
    assertTrue(status.contains("Status: OFF"), "Status should show OFF initially");
  }

  @Test
  void testDeviceProperties() {
    assertEquals("L1", light.getDeviceId(), "Device ID should match");
    assertEquals("Living Room Light", light.getDeviceName(), "Device name should match");
    assertFalse(light.isLinked(), "Device should not be linked initially");
  }
}

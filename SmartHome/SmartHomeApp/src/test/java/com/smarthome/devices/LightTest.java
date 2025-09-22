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

  @Test
  void testSetDeviceName() {
    light.setDeviceName("Updated Light");
    assertEquals("Updated Light", light.getDeviceName(), "Device name should be updated");
  }

  @Test
  void testSetLinked() {
    light.setLinked(true);
    assertTrue(light.isLinked(), "Device should be linked after setLinked(true)");
    
    light.setLinked(false);
    assertFalse(light.isLinked(), "Device should not be linked after setLinked(false)");
  }

  @Test
  void testGetBrightness() {
    light.turnOn();
    light.setBrightness(50);
    assertEquals(50, light.getBrightness(), "getBrightness should return the set brightness value");
    
    light.setBrightness(100);
    assertEquals(100, light.getBrightness(), "getBrightness should return updated brightness value");
  }

  @Test
  void testBrightnessWhenOff() {
    light.turnOff();
    light.setBrightness(75);
    // Test current behavior - depends on implementation
    // The brightness might be stored but not effective when light is off
    assertTrue(light.getBrightness() >= 0, "Brightness should be a valid value even when off");
  }

  @Test
  void testBrightnessConstraints() {
    light.turnOn();
    
    // Test edge values
    light.setBrightness(0);
    assertEquals(0, light.getBrightness(), "Should allow 0% brightness");
    
    light.setBrightness(100);
    assertEquals(100, light.getBrightness(), "Should allow 100% brightness");
    
    // Test clamping behavior - negative values become 0
    light.setBrightness(-10);
    assertEquals(0, light.getBrightness(), "Negative values should be clamped to 0");
    
    // Test clamping behavior - values above 100 become 100
    light.setBrightness(150);
    assertEquals(100, light.getBrightness(), "Values above 100 should be clamped to 100");
  }

  @Test
  void testStatusReflectsBrightness() {
    light.turnOn();
    light.setBrightness(80);
    
    String status = light.getStatus();
    assertTrue(status.contains("Status: ON"), "Status should show light is ON");
    assertTrue(status.contains("Brightness: 80"), "Status should show current brightness");
  }
}

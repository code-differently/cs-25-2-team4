package com.smarthome.devices;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ThermostatTest {
  private Thermostat thermostat;

  @BeforeEach
  void setUp() {
    thermostat = new Thermostat("T1", "Main Thermostat");
  }

  @Test
  void testSetAndGetTemperature() {
    thermostat.setTemp(22.5);
    assertEquals(22.5, thermostat.getTemp(), 0.01, "Temperature should match the value set");
  }

  @Test
  void testThermostatStatus() {
    String status = thermostat.getStatus();
    assertTrue(status.contains("Thermostat ID: T1"), "Status should contain thermostat ID");
  }

  @Test
  void testDeviceProperties() {
    assertEquals("T1", thermostat.getDeviceId(), "Device ID should match");
    assertEquals("Main Thermostat", thermostat.getDeviceName(), "Device name should match");
    assertFalse(thermostat.isLinked(), "Device should not be linked initially");
  }
}

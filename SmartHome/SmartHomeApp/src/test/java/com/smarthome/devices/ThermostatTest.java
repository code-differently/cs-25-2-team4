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

  @Test
  void testTurnOnAndOff() {
    // Test turnOn
    thermostat.turnOn();
    assertTrue(thermostat.isOn(), "Thermostat should be on after turnOn()");

    // Test turnOff
    thermostat.turnOff();
    assertFalse(thermostat.isOn(), "Thermostat should be off after turnOff()");
  }

  @Test
  void testSetDeviceName() {
    thermostat.setDeviceName("Updated Thermostat");
    assertEquals("Updated Thermostat", thermostat.getDeviceName(), "Device name should be updated");
  }

  @Test
  void testSetLinked() {
    thermostat.setLinked(true);
    assertTrue(thermostat.isLinked(), "Device should be linked after setLinked(true)");

    thermostat.setLinked(false);
    assertFalse(thermostat.isLinked(), "Device should not be linked after setLinked(false)");
  }

  @Test
  void testTemperatureConstraints() {
    // Test setting extreme temperatures
    thermostat.setTemp(-10.0);
    assertEquals(-10.0, thermostat.getTemp(), 0.01, "Should allow negative temperatures");

    thermostat.setTemp(50.0);
    assertEquals(50.0, thermostat.getTemp(), 0.01, "Should allow high temperatures");

    thermostat.setTemp(0.0);
    assertEquals(0.0, thermostat.getTemp(), 0.01, "Should allow zero temperature");
  }

  @Test
  void testStatusReflectsState() {
    // Test status when off
    thermostat.turnOff();
    thermostat.setTemp(25.0);
    String statusOff = thermostat.getStatus();
    assertTrue(statusOff.contains("OFF"), "Status should indicate thermostat is off");
    assertTrue(statusOff.contains("25.0"), "Status should contain current temperature");

    // Test status when on
    thermostat.turnOn();
    String statusOn = thermostat.getStatus();
    assertTrue(statusOn.contains("ON"), "Status should indicate thermostat is on");
    assertTrue(statusOn.contains("T1"), "Status should contain thermostat ID");
    assertTrue(statusOn.contains("Main Thermostat"), "Status should contain thermostat name");
  }
}

package com.smarthome.app;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.devices.Light;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class HomeManagerTest {
  private HomeManager homeManager;
  private Room room;
  private Light light;

  @BeforeEach
  void setUp() {
    homeManager = new HomeManager("Account123");
    room = new Room("Living Room");
    light = new Light("L1", "Living Room Light");
  }

  @Test
  void testAddAndDeleteRoom() {
    homeManager.addRoom(room);
    assertTrue(
        homeManager.getRooms().contains(room), "HomeManager should contain room after adding it");
    homeManager.deleteRoom(room);
    assertFalse(
        homeManager.getRooms().contains(room),
        "HomeManager should not contain room after deleting it");
  }

  @Test
  void testAddAndRemoveDeviceFromHomeManager() {
    homeManager.addRoom(room);
    homeManager.addDevice(light, room);
    assertTrue(
        homeManager.getDevices().contains(light),
        "HomeManager should contain device after adding it");
    homeManager.removeDevice(light);
    assertFalse(
        homeManager.getDevices().contains(light),
        "HomeManager should not contain device after removing it");
  }

  @Test
  void testHomeManagerProperties() {
    assertEquals("Account123", homeManager.getAccountId(), "Account ID should match");
    assertTrue(homeManager.getRooms().isEmpty(), "HomeManager should have no rooms initially");
    assertTrue(
        homeManager.getAllDevices().isEmpty(), "HomeManager should have no devices initially");
  }

  @Test
  void testGetDeviceByName() {
    homeManager.addRoom(room);
    homeManager.addDevice(light, room);
    assertEquals(
        light, homeManager.getDevicebyName("Living Room Light"), "Should find device by name");
    assertNull(
        homeManager.getDevicebyName("Nonexistent Device"),
        "Should return null for nonexistent device");
  }
}

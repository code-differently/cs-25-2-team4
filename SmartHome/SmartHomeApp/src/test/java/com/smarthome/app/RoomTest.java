package com.smarthome.app;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.devices.Light;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class RoomTest {
  private Room room;
  private Light light;

  @BeforeEach
  void setUp() {
    room = new Room("Living Room");
    light = new Light("L1", "Living Room Light", "Living Room");
  }

  @Test
  void testAddAndRemoveDeviceInRoom() {
    room.addDevice(light);
    assertTrue(room.getDevices().contains(light), "Room should contain light after adding it");
    room.removeDevice(light);
    assertFalse(
        room.getDevices().contains(light), "Room should not contain light after removing it");
  }

  @Test
  void testRoomProperties() {
    assertEquals("Living Room", room.getRoomName(), "Room name should match");
    assertNotNull(room.getRoomID(), "Room ID should not be null");
    assertTrue(room.getDevices().isEmpty(), "Room should have no devices initially");
  }
}

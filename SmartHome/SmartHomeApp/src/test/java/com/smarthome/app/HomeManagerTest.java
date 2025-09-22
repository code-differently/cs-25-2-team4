package com.smarthome.app;

import static org.junit.jupiter.api.Assertions.*;


import com.smarthome.devices.Light;
import com.smarthome.devices.Thermostat;
import com.smarthome.exceptions.DeviceNotFoundException;
import com.smarthome.exceptions.RoomNotFoundException;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class HomeManagerTest {

  private HomeManager homeManager;
  private Room room1;
  private Room room2;
  private Light light1;
  private Thermostat thermostat1;

  @BeforeEach
  void setUp() {
    homeManager = new HomeManager("Account123");

    room1 = new Room("Living Room");
    room2 = new Room("Bedroom");

    light1 = new Light("L1", "Living Room Light");
    thermostat1 = new Thermostat("T1", "Main Thermostat");
  }

  @Test
  void testAddAndDeleteRoom() {
    assertTrue(homeManager.addRoom(room1));
    assertTrue(homeManager.getRooms().contains(room1));

    assertTrue(homeManager.deleteRoom(room1));
    assertFalse(homeManager.getRooms().contains(room1));
  }

  @Test
  void testAddDuplicateRoom() {
    homeManager.addRoom(room1);
    assertFalse(homeManager.addRoom(room1), "Adding duplicate room should return false");
  }

  @Test
  void testAddAndRemoveDevice() {
    homeManager.addRoom(room1);
    assertTrue(homeManager.addDevice(light1, room1), "Device should be added successfully");

    assertTrue(homeManager.getAllDevices().contains(light1));

    assertTrue(homeManager.removeDevice(light1), "Device should be removed successfully");
    assertFalse(homeManager.getAllDevices().contains(light1));
  }

  @Test
  void testAddDeviceToNonexistentRoom() {
    assertFalse(
        homeManager.addDevice(thermostat1, room2), "Cannot add device to room not in HomeManager");
  }

  @Test
  void testGetRoomByName() {
    homeManager.addRoom(room1);
    homeManager.addRoom(room2);

    assertEquals(room1, homeManager.getRoombyName("Living Room"));
    assertEquals(room2, homeManager.getRoombyName("bedroom")); // case-insensitive
    assertThrows(
        RoomNotFoundException.class,
        () -> homeManager.getRoombyName("Kitchen"),
        "Room not found: Kitchen");
  }

  @Test
  void testGetDeviceByName() {
    homeManager.addRoom(room1);
    homeManager.addDevice(light1, room1);
    homeManager.addDevice(thermostat1, room1);

    assertEquals(light1, homeManager.getDevicebyName("Living Room Light"));
    assertEquals(thermostat1, homeManager.getDevicebyName("main thermostat")); // case-insensitive
    assertNull(homeManager.getDevicebyName("Unknown Device"));
  }

  @Test
  void testGetRoomsReturnsUnmodifiableSet() {
    homeManager.addRoom(room1);
    Set<Room> rooms = homeManager.getRooms();
    assertThrows(UnsupportedOperationException.class, () -> rooms.add(room2));
  }

  @Test
  void testGetAccountId() {
    assertEquals("Account123", homeManager.getAccountId());

    // Test with different account ID
    HomeManager homeManager2 = new HomeManager("DifferentAccount");
    assertEquals("DifferentAccount", homeManager2.getAccountId());
  }

  @Test
  void testGetDeviceById() {
    homeManager.addRoom(room1);
    homeManager.addDevice(light1, room1);
    homeManager.addDevice(thermostat1, room1);

    assertEquals(light1, homeManager.getDeviceById("L1"));
    assertEquals(thermostat1, homeManager.getDeviceById("T1"));
    assertEquals(light1, homeManager.getDeviceById("l1")); // case-insensitive
    assertNull(homeManager.getDeviceById("NonExistentId"));
    assertNull(homeManager.getDeviceById(null));
  }

  @Test
  void testRemoveDeviceEdgeCases() {
    homeManager.addRoom(room1);
    homeManager.addRoom(room2);
    homeManager.addDevice(light1, room1);

    // Test removing null device
    assertThrows(
        DeviceNotFoundException.class,
        () -> homeManager.removeDevice(null),
        "Device cannot be null");

    // Test removing device that doesn't exist
    Light nonExistentLight = new Light("L999", "Non-existent Light");
    assertThrows(
        DeviceNotFoundException.class,
        () -> homeManager.removeDevice(nonExistentLight),
        "Device not found in any room");

    // Test successful removal
    assertTrue(homeManager.removeDevice(light1));
    assertFalse(homeManager.getAllDevices().contains(light1));
  }

  @Test
  void testDeleteRoomEdgeCases() {
    homeManager.addRoom(room1);

    // Test deleting null room
    assertThrows(
        RoomNotFoundException.class, () -> homeManager.deleteRoom(null), "Room not found: null");

    // Test deleting room that doesn't exist
    assertThrows(
        RoomNotFoundException.class, () -> homeManager.deleteRoom(room2), "Room not found");

    // Test successful deletion
    assertTrue(homeManager.deleteRoom(room1));
    assertFalse(homeManager.getRooms().contains(room1));
  }

  // Test exception constructor within context of HomeManager operations
  @Test
  void testRoomNotFoundExceptionConstructor() {
    // Test message constructor (the only available constructor)
    RoomNotFoundException messageException = new RoomNotFoundException("Test message");
    assertEquals("Test message", messageException.getMessage());
  }
}

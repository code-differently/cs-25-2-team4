package com.smarthome.app;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.devices.Device;
import com.smarthome.devices.Light;
import com.smarthome.devices.Thermostat;
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
    assertTrue(homeManager.getDevices().contains(light1));

    assertTrue(homeManager.removeDevice(light1), "Device should be removed successfully");
    assertFalse(homeManager.getDevices().contains(light1));
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
    assertThrows(RoomNotFoundException.class, () -> homeManager.getRoombyName("Kitchen"), "Room not found: Kitchen");
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
  void testGetAllDevicesReturnsUnmodifiableSet() {
    homeManager.addRoom(room1);
    homeManager.addDevice(light1, room1);

    Set<Device> devices = homeManager.getDevices();
    assertThrows(UnsupportedOperationException.class, () -> devices.add(thermostat1));
  }

  @Test
  void testGetRoomsReturnsUnmodifiableSet() {
    homeManager.addRoom(room1);
    Set<Room> rooms = homeManager.getRooms();
    assertThrows(UnsupportedOperationException.class, () -> rooms.add(room2));
  }
}

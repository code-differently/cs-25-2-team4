package com.smarthome.integration;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.devices.*;
import com.smarthome.exceptions.*;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/**
 * Integration tests for HomeManager that test the complete interaction between HomeManager, Rooms,
 * and various Device types in realistic scenarios.
 */
public class HomeManagerIntegrationTest {

  private HomeManager homeManager;
  private Room livingRoom;
  private Room bedroom;
  private Room kitchen;

  // Various device types
  private Light livingRoomLight;
  private Light bedroomLight;
  private Light kitchenLight;
  private Thermostat livingRoomThermostat;
  private Thermostat bedroomThermostat;
  private SecurityCamera frontDoorCamera;
  private SecurityCamera backYardCamera;

  @BeforeEach
  void setUp() {
    // Initialize HomeManager
    homeManager = new HomeManager("INTEGRATION_TEST_ACCOUNT");

    // Create rooms
    livingRoom = new Room("Living Room");
    bedroom = new Room("Bedroom");
    kitchen = new Room("Kitchen");

    // Create various devices
    livingRoomLight = new Light("LL001", "Living Room Main Light");
    bedroomLight = new Light("BL001", "Bedroom Ceiling Light");
    kitchenLight = new Light("KL001", "Kitchen LED Strip");

    livingRoomThermostat = new Thermostat("LT001", "Living Room Thermostat");
    bedroomThermostat = new Thermostat("BT001", "Bedroom Thermostat");

    frontDoorCamera = new SecurityCamera("FDC001", "Front Door Camera");
    backYardCamera = new SecurityCamera("BYC001", "Back Yard Camera");

    // Add rooms to home manager
    homeManager.addRoom(livingRoom);
    homeManager.addRoom(bedroom);
    homeManager.addRoom(kitchen);
  }

  @Nested
  @DisplayName("Multi-Room Device Management")
  class MultiRoomDeviceManagement {

    @Test
    @DisplayName("Should successfully add devices to multiple rooms")
    void testAddDevicesToMultipleRooms() {
      // Add devices to different rooms
      assertTrue(homeManager.addDevice(livingRoomLight, livingRoom));
      assertTrue(homeManager.addDevice(livingRoomThermostat, livingRoom));
      assertTrue(homeManager.addDevice(frontDoorCamera, livingRoom));

      assertTrue(homeManager.addDevice(bedroomLight, bedroom));
      assertTrue(homeManager.addDevice(bedroomThermostat, bedroom));

      assertTrue(homeManager.addDevice(kitchenLight, kitchen));
      assertTrue(homeManager.addDevice(backYardCamera, kitchen));

      // Verify all devices are accessible through HomeManager
      Set<Device> allDevices = homeManager.getAllDevices();
      assertEquals(7, allDevices.size());

      // Verify devices are in correct rooms
      assertEquals(3, livingRoom.getDevices().size());
      assertEquals(2, bedroom.getDevices().size());
      assertEquals(2, kitchen.getDevices().size());

      // Verify specific devices can be found
      assertNotNull(homeManager.getDevicebyName("Living Room Main Light"));
      assertNotNull(homeManager.getDevicebyName("Bedroom Thermostat"));
      assertNotNull(homeManager.getDevicebyName("Back Yard Camera"));
    }

    @Test
    @DisplayName("Should handle device removal from multiple rooms")
    void testRemoveDevicesFromMultipleRooms() {
      // Setup: Add devices to rooms first
      homeManager.addDevice(livingRoomLight, livingRoom);
      homeManager.addDevice(bedroomLight, bedroom);
      homeManager.addDevice(kitchenLight, kitchen);
      homeManager.addDevice(frontDoorCamera, livingRoom);

      assertEquals(4, homeManager.getAllDevices().size());

      // Remove devices
      assertTrue(homeManager.removeDevice(bedroomLight));
      assertTrue(homeManager.removeDevice(frontDoorCamera));

      // Verify removal
      assertEquals(2, homeManager.getAllDevices().size());
      assertEquals(1, livingRoom.getDevices().size());
      assertEquals(0, bedroom.getDevices().size());
      assertEquals(1, kitchen.getDevices().size());

      assertNull(homeManager.getDevicebyName("Bedroom Ceiling Light"));
      assertNull(homeManager.getDevicebyName("Front Door Camera"));
    }

    @Test
    @DisplayName("Should handle room deletion with devices")
    void testDeleteRoomWithDevices() {
      // Add devices to bedroom
      homeManager.addDevice(bedroomLight, bedroom);
      homeManager.addDevice(bedroomThermostat, bedroom);

      assertEquals(2, homeManager.getAllDevices().size());
      assertEquals(2, bedroom.getDevices().size());

      // Delete the bedroom
      homeManager.deleteRoom(bedroom);

      // Verify room is deleted but devices still exist in HomeManager's tracking
      // (This depends on implementation - devices might be orphaned)
      assertFalse(homeManager.getRooms().contains(bedroom));
    }
  }

  @Nested
  @DisplayName("Device Command Integration")
  class DeviceCommandIntegration {

    @BeforeEach
    void setUpDevices() {
      // Add all devices to their respective rooms
      homeManager.addDevice(livingRoomLight, livingRoom);
      homeManager.addDevice(livingRoomThermostat, livingRoom);
      homeManager.addDevice(bedroomLight, bedroom);
      homeManager.addDevice(bedroomThermostat, bedroom);
      homeManager.addDevice(frontDoorCamera, kitchen);
    }

    @Test
    @DisplayName("Should execute commands on different device types")
    void testCommandExecutionOnDifferentDeviceTypes() {
      // Test Light commands
      assertDoesNotThrow(() -> homeManager.sendCommand(livingRoomLight, "turnOn", null));
      assertTrue(livingRoomLight.isOn());

      assertDoesNotThrow(() -> homeManager.sendCommand(livingRoomLight, "setBrightness", 75));

      assertDoesNotThrow(() -> homeManager.sendCommand(bedroomLight, "turnOn", null));
      assertTrue(bedroomLight.isOn());

      // Test Thermostat commands
      assertDoesNotThrow(() -> homeManager.sendCommand(livingRoomThermostat, "turnOn", null));
      assertTrue(livingRoomThermostat.isOn());

      assertDoesNotThrow(() -> homeManager.sendCommand(bedroomThermostat, "setTemp", 22.5));
      assertEquals(22.5, bedroomThermostat.getTemp());

      // Test SecurityCamera commands
      assertDoesNotThrow(() -> homeManager.sendCommand(frontDoorCamera, "startRecording", null));
      assertTrue(frontDoorCamera.isRecording());

      assertDoesNotThrow(() -> homeManager.sendCommand(frontDoorCamera, "stopRecording", null));
      assertFalse(frontDoorCamera.isRecording());
    }

    @Test
    @DisplayName("Should handle command execution across multiple devices")
    void testBulkCommandExecution() {
      // Turn on all lights
      for (Device device : homeManager.getAllDevices()) {
        if (device instanceof Light) {
          assertDoesNotThrow(() -> homeManager.sendCommand(device, "turnOn", null));
          assertTrue(((Light) device).isOn());
        }
      }

      // Turn on all thermostats
      for (Device device : homeManager.getAllDevices()) {
        if (device instanceof Thermostat) {
          assertDoesNotThrow(() -> homeManager.sendCommand(device, "turnOn", null));
          assertTrue(((Thermostat) device).isOn());
        }
      }

      // Verify all switchable devices are on
      for (Device device : homeManager.getAllDevices()) {
        if (device instanceof SwitchableDevice) {
          assertDoesNotThrow(() -> homeManager.sendCommand(device, "turnOn", null));
          assertTrue(((SwitchableDevice) device).isOn());
        }
      }
    }

    @Test
    @DisplayName("Should handle invalid commands gracefully")
    void testInvalidCommandHandling() {
      // Test invalid command on valid device
      InvalidCommandException exception =
          assertThrows(
              InvalidCommandException.class,
              () -> homeManager.sendCommand(livingRoomLight, "invalidMethod", null));

      assertTrue(exception.getMessage().contains("Light"));

      // Test command on non-existent device
      Light unregisteredLight = new Light("UNREGISTERED", "Unregistered Light");

      assertThrows(
          DeviceNotFoundException.class,
          () -> homeManager.sendCommand(unregisteredLight, "turnOn", null));

      // Test null device
      assertThrows(
          DeviceNotFoundException.class, () -> homeManager.sendCommand(null, "turnOn", null));
    }
  }

  @Nested
  @DisplayName("Complex Integration Scenarios")
  class ComplexIntegrationScenarios {

    @Test
    @DisplayName("Should handle complete home automation scenario")
    void testCompleteHomeAutomationScenario() throws InvalidCommandException {
      // Setup a complete smart home
      setupCompleteSmartHome();

      // Scenario: Evening routine
      // 1. Turn on all lights
      executeCommandOnDeviceType(Light.class, "turnOn", null);

      // 2. Set living room light to low brightness
      homeManager.sendCommand(livingRoomLight, "setBrightness", 30);

      // 3. Set thermostats to evening temperature
      homeManager.sendCommand(livingRoomThermostat, "setTemp", 21.0);
      homeManager.sendCommand(bedroomThermostat, "setTemp", 19.0);

      // 4. Start security cameras
      homeManager.sendCommand(frontDoorCamera, "startRecording", null);
      homeManager.sendCommand(backYardCamera, "startRecording", null);

      // Verify the scenario executed correctly
      verifyEveningRoutineState();
    }

    @Test
    @DisplayName("Should handle device migration between rooms")
    void testDeviceMigrationBetweenRooms() {
      // Add a portable device to living room
      Light portableLight = new Light("PL001", "Portable Light");
      homeManager.addDevice(portableLight, livingRoom);

      assertEquals(1, livingRoom.getDevices().size());
      assertEquals(0, bedroom.getDevices().size());
      assertTrue(homeManager.getAllDevices().contains(portableLight));

      // Move device to bedroom by removing and re-adding
      assertTrue(homeManager.removeDevice(portableLight));
      assertTrue(homeManager.addDevice(portableLight, bedroom));

      // Verify migration
      assertEquals(0, livingRoom.getDevices().size());
      assertEquals(1, bedroom.getDevices().size());
      assertTrue(bedroom.getDevices().contains(portableLight));
      assertTrue(homeManager.getAllDevices().contains(portableLight));

      // Verify device still works after migration
      assertDoesNotThrow(() -> homeManager.sendCommand(portableLight, "turnOn", null));
      assertTrue(portableLight.isOn());
    }

    @Test
    @DisplayName("Should handle room operations with error recovery")
    void testRoomOperationsWithErrorRecovery() {
      // Add devices to rooms
      homeManager.addDevice(livingRoomLight, livingRoom);
      homeManager.addDevice(bedroomLight, bedroom);

      // Try to delete non-existent room
      Room nonExistentRoom = new Room("Non-existent Room");

      assertThrows(RoomNotFoundException.class, () -> homeManager.deleteRoom(nonExistentRoom));

      // Verify original rooms and devices are still intact
      assertEquals(3, homeManager.getRooms().size());
      assertEquals(2, homeManager.getAllDevices().size());

      // Verify devices still work
      assertDoesNotThrow(() -> homeManager.sendCommand(livingRoomLight, "turnOn", null));
      assertDoesNotThrow(() -> homeManager.sendCommand(bedroomLight, "turnOn", null));

      assertTrue(livingRoomLight.isOn());
      assertTrue(bedroomLight.isOn());
    }
  }

  // Helper methods for complex scenarios
  private void setupCompleteSmartHome() {
    homeManager.addDevice(livingRoomLight, livingRoom);
    homeManager.addDevice(livingRoomThermostat, livingRoom);
    homeManager.addDevice(bedroomLight, bedroom);
    homeManager.addDevice(bedroomThermostat, bedroom);
    homeManager.addDevice(kitchenLight, kitchen);
    homeManager.addDevice(frontDoorCamera, livingRoom);
    homeManager.addDevice(backYardCamera, kitchen);
  }

  private void executeCommandOnDeviceType(Class<?> deviceType, String command, Object value) {
    for (Device device : homeManager.getAllDevices()) {
      if (deviceType.isInstance(device)) {
        assertDoesNotThrow(
            () -> {
              try {
                homeManager.sendCommand(device, command, value);
              } catch (InvalidCommandException e) {
                throw new RuntimeException(e);
              }
            });
      }
    }
  }

  private void verifyEveningRoutineState() {
    // Verify all lights are on
    for (Device device : homeManager.getAllDevices()) {
      if (device instanceof Light) {
        assertTrue(((Light) device).isOn(), "Light " + device.getDeviceName() + " should be on");
      }
    }

    // Verify thermostats are set correctly
    assertEquals(21.0, livingRoomThermostat.getTemp());
    assertEquals(19.0, bedroomThermostat.getTemp());

    // Verify cameras are recording
    assertTrue(frontDoorCamera.isRecording());
    assertTrue(backYardCamera.isRecording());
  }

  @Nested
  @DisplayName("Performance and Stress Testing")
  class PerformanceAndStressTesting {

    @Test
    @DisplayName("Should handle large number of devices efficiently")
    void testLargeNumberOfDevices() {
      // Create many rooms and devices
      for (int i = 0; i < 50; i++) {
        Room room = new Room("Room " + i);
        homeManager.addRoom(room);

        Light light = new Light("L" + i, "Light " + i);
        Thermostat thermostat = new Thermostat("T" + i, "Thermostat " + i);

        homeManager.addDevice(light, room);
        homeManager.addDevice(thermostat, room);
      }

      // Verify all devices are tracked
      assertEquals(100, homeManager.getAllDevices().size());
      assertEquals(53, homeManager.getRooms().size()); // 50 + 3 original

      // Test command execution performance on many devices
      long startTime = System.currentTimeMillis();

      for (Device device : homeManager.getAllDevices()) {
        if (device instanceof SwitchableDevice) {
          assertDoesNotThrow(() -> homeManager.sendCommand(device, "turnOn", null));
        }
      }

      long endTime = System.currentTimeMillis();
      long executionTime = endTime - startTime;

      // Ensure reasonable performance (adjust threshold as needed)
      assertTrue(executionTime < 1000, "Command execution took too long: " + executionTime + "ms");
    }
  }
}

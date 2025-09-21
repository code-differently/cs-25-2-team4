package com.smarthome.cli;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.devices.*;
import com.smarthome.scene.Action;
import com.smarthome.scene.Rule;
import com.smarthome.scene.RuleEngine;
import com.smarthome.scene.Scene;
import com.smarthome.scene.SceneManager;
import java.util.Scanner;

public class HomePrompter {
  private final Scanner scanner;
  private final HomeManager homeManager;
  private final SceneManager sceneManager;
  private final RuleEngine ruleEngine;

  public HomePrompter(
      Scanner scanner, HomeManager homeManager, SceneManager sceneManager, RuleEngine ruleEngine) {
    this.scanner = scanner;
    this.homeManager = homeManager;
    this.sceneManager = sceneManager;
    this.ruleEngine = ruleEngine;
  }

  public void startMenuLoop() {
    boolean running = true;
    while (running) {
      printMenu();
      String choice = scanner.nextLine().trim();
      switch (choice) {
        case "1":
          addRoom();
          break;
        case "2":
          listRooms();
          break;
        case "3":
          addDevice();
          break;
        case "4":
          listDevicesInRoom();
          break;
        case "5":
          toggleDevice();
          break;
        case "6":
          createScene();
          break;
        case "7":
          listScenes();
          break;
        case "8":
          runScene();
          break;
        case "9":
          addRule();
          break;
        case "10":
          running = false;
          break;
        case "11":
          simulateEvent();
          break;
        default:
          System.out.println("Invalid option.");
          break;
      }
    }
    System.out.println("✅ Smart Home Application terminated.");
  }

  private void printMenu() {
    System.out.println("\nSmartHome Menu");
    System.out.println("1. Add Room");
    System.out.println("2. List Rooms");
    System.out.println("3. Add Device to Room");
    System.out.println("4. List Devices in a Room");
    System.out.println("5. Toggle Switchable Device (on/off)");
    System.out.println("6. Create Scene");
    System.out.println("7. List Scenes");
    System.out.println("8. Run Scene");
    System.out.println("9. Add Rule");
    System.out.println("10. Exit");
    System.out.println("11. Simulate Event");
    System.out.print(">> Your choice: ");
  }

  // === ROOM METHODS ===
  private void addRoom() {
    System.out.print("Enter room name: ");
    String name = scanner.nextLine().trim();
    Room room = new Room(name);
    if (homeManager.addRoom(room)) {
      System.out.println("Room added: " + name);
    } else {
      System.out.println("Room already exists.");
    }
  }

  private void listRooms() {
    System.out.println("Rooms:");
    homeManager.getRooms().forEach(r -> System.out.println(" - " + r.getRoomName()));
  }

  // === DEVICE METHODS ===
  private void addDevice() {
    System.out.print("Enter room name: ");
    String roomName = scanner.nextLine().trim();
    Room room = homeManager.getRoombyName(roomName);
    if (room == null) {
      System.out.println("Room not found.");
      return;
    }
    System.out.print("Enter device type (light/thermostat/securitycamera): ");
    String type = scanner.nextLine().trim().toLowerCase();
    System.out.print("Enter device ID: ");
    String id = scanner.nextLine().trim();
    System.out.print("Enter device name: ");
    String name = scanner.nextLine().trim();

    Device device;
    switch (type) {
      case "light":
        device = new Light(id, name);
        break;
      case "thermostat":
        device = new Thermostat(id, name);
        break;
      case "securitycamera":
        device = new SecurityCamera(id, name);
        break;
      default:
        System.out.println("Unknown device type.");
        return;
    }

    if (homeManager.addDevice(device, room)) {
      System.out.println("Device added: " + name + " (" + type + ")");
    } else {
      System.out.println("Failed to add device.");
    }
  }

  private void listDevicesInRoom() {
    System.out.print("Enter room name: ");
    String roomName = scanner.nextLine().trim();
    Room room = homeManager.getRoombyName(roomName);
    if (room == null) {
      System.out.println("Room not found.");
      return;
    }
    System.out.println("Devices in " + roomName + ":");
    room.getDevices()
        .forEach(
            d ->
                System.out.println(
                    " - "
                        + d.getDeviceName()
                        + " ["
                        + d.getDeviceId()
                        + "] Status: "
                        + d.getStatus()));
  }

  private void toggleDevice() {
    System.out.print("Enter device name: ");
    String name = scanner.nextLine().trim();
    Device device = homeManager.getDevicebyName(name);
    if (!(device instanceof SwitchableDevice)) {
      System.out.println("Device is not switchable.");
      return;
    }
    SwitchableDevice s = (SwitchableDevice) device;
    System.out.print("Turn ON or OFF? ");
    String cmd = scanner.nextLine().trim().toLowerCase();
    if (cmd.equals("on")) s.turnOn();
    else if (cmd.equals("off")) s.turnOff();
    System.out.println(device.getStatus());
  }

  // === SCENE METHODS ===
  private void createScene() {
    System.out.print("Enter scene name: ");
    String sceneName = scanner.nextLine().trim();
    Scene scene = new Scene(sceneName);

    while (true) {
      System.out.print("Add action? (yes/no): ");
      if (!scanner.nextLine().trim().equalsIgnoreCase("yes")) break;
      System.out.print("Enter device name for action: ");
      String deviceName = scanner.nextLine().trim();
      Device device = homeManager.getDevicebyName(deviceName);
      if (device == null) {
        System.out.println("Device not found.");
        continue;
      }
      System.out.print("Enter command (e.g., turnOn, turnOff, setBrightness): ");
      String command = scanner.nextLine().trim();
      System.out.print("Enter value (or press enter for none): ");
      String value = scanner.nextLine().trim();

      Action action;
      if (value.isEmpty()) {
        action = new Action(device.getDeviceId(), command);
      } else {
        action = new Action(device.getDeviceId(), command, value);
      }
      scene.addAction(action);
    }

    sceneManager.addScene(scene);
    System.out.println("Scene created: " + sceneName);
  }

  private void listScenes() {
    System.out.println("Scenes:");
    sceneManager.getScenes().forEach(s -> System.out.println(" - " + s.getName()));
  }

  private void runScene() {
    System.out.print("Enter scene name: ");
    String name = scanner.nextLine().trim();
    try {
      sceneManager.executeScene(name);
      System.out.println("Scene executed: " + name);
    } catch (Exception e) {
      System.out.println("Failed to execute scene: " + e.getMessage());
    }
  }

  // === RULE METHODS ===
  private void addRule() {
    System.out.print("Enter scene name for the rule: ");
    String sceneName = scanner.nextLine().trim();
    Scene scene = sceneManager.getSceneByName(sceneName);
    if (scene == null) {
      System.out.println("Scene not found.");
      return;
    }

    System.out.print("Enter trigger device name (or press enter for global event): ");
    String deviceName = scanner.nextLine().trim();
    Device device = null;
    if (!deviceName.isEmpty()) {
      device = homeManager.getDevicebyName(deviceName);
      if (device == null) {
        System.out.println("Device not found.");
        return;
      }
    }

    System.out.print("Enter trigger event (e.g., motion_detected): ");
    String event = scanner.nextLine().trim();

    try {
      Rule rule;
      if (device != null) {
        // Device-specific rule
        rule = new Rule(event, device.getDeviceId(), scene);
      } else {
        // Global event rule
        rule = new Rule(event, scene);
      }
      ruleEngine.addRule(rule);
      System.out.println("Rule added for scene '" + sceneName + "' on event '" + event + "'");
    } catch (Exception e) {
      System.out.println("Failed to add rule: " + e.getMessage());
    }
  }

  private void simulateEvent() {
    System.out.print("Enter device name to simulate event: ");
    String deviceName = scanner.nextLine().trim();
    Device device = homeManager.getDevicebyName(deviceName);
    if (device == null) {
      System.out.println("Device not found.");
      return;
    }
    System.out.print("Enter event type (e.g., motion_detected): ");
    String eventType = scanner.nextLine().trim();
    System.out.println("\nSimulating event: " + eventType + " on " + deviceName);
    ruleEngine.handleEvent(eventType, device.getDeviceId());
  }
}

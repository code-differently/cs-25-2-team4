package com.smarthome.scene;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.devices.Device;
import com.smarthome.exceptions.RuleConflictException;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** Evaluates rules and triggers scenes and notifications. */
public class RuleEngine {

  private final HomeManager homeManager;
  private final SceneManager sceneManager;
  private final NotificationService notificationService;
  private final List<Rule> rules;

  public RuleEngine(
      HomeManager homeManager, SceneManager sceneManager, NotificationService notificationService) {
    this.homeManager = homeManager;
    this.sceneManager = sceneManager;
    this.notificationService = notificationService;
    this.rules = new ArrayList<>();
  }

  /** Adds a rule if it does not conflict with existing rules. */
  public void addRule(Rule rule) throws RuleConflictException {
    Optional<Rule> conflict =
        rules.stream()
            .filter(
                r ->
                    r.getTriggerDeviceName().equalsIgnoreCase(rule.getTriggerDeviceName())
                        && r.getTriggerEvent().equalsIgnoreCase(rule.getTriggerEvent()))
            .findFirst();

    if (conflict.isPresent()) {
      throw new RuleConflictException(
          "Conflict detected: Device "
              + rule.getTriggerDeviceName()
              + " already has a rule for event "
              + rule.getTriggerEvent());
    }

    rules.add(rule);
  }

  /** Handles an incoming event from a device. */
  public void handleEvent(String eventType, String deviceName) {
    System.out.println("\nRuleEngine received event: " + eventType + " from " + deviceName);

    for (Rule rule : rules) {
      if (evaluateRule(rule, eventType, deviceName)) {
        executeActions(rule);
      }
    }
  }

  /** Evaluates a single rule. */
  private boolean evaluateRule(Rule rule, String eventType, String deviceName) {
    boolean eventMatches =
        rule.getTriggerEvent().equalsIgnoreCase(eventType)
            && rule.getTriggerDeviceName().equalsIgnoreCase(deviceName);

    // Example: only trigger after 11 PM
    boolean timeMatches = LocalTime.now().isAfter(LocalTime.of(23, 0));

    return eventMatches && timeMatches;
  }

  /** Executes the target scene and sends notification. */
  private void executeActions(Rule rule) {
    // Use scene manager
    Scene targetScene = sceneManager.getSceneByName(rule.getTargetSceneName());

    if (targetScene != null) {
      System.out.println("Executing Scene: " + targetScene.getName());
      for (Action a : targetScene.getActions()) {
        Device device = homeManager.getDevicebyName(a.getDeviceId());
        if (device != null) {
          try {
            homeManager.sendCommand(device, a.getCommand(), a.getValue());
          } catch (Exception e) {
            System.err.println("Failed to execute action on device " + device.getDeviceId());
          }
        }
      }
    } else {
      System.err.println("ERROR: Scene not found: " + rule.getTargetSceneName());
    }

    // ✅ triggeredDevice is now by name
    Device triggeredDevice = homeManager.getDevicebyName(rule.getTriggerDeviceName());

    Room room =
        homeManager.getRooms().stream()
            .filter(r -> r.getDevices().contains(triggeredDevice))
            .findFirst()
            .orElse(null);

    String roomName = room != null ? room.getRoomName() : "Unknown";
    notificationService.sendAlert("ALERT: Motion detected after 11 PM in " + roomName);
  }
}

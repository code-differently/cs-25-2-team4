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
                r -> {
                  // Check if both rules have the same trigger event
                  boolean eventMatches = r.getTriggerEvent().equalsIgnoreCase(rule.getTriggerEvent());
                  
                  // Check if device names match (handling null for global events)
                  boolean deviceMatches;
                  if (r.getTriggerDeviceName() == null && rule.getTriggerDeviceName() == null) {
                    deviceMatches = true; // Both are global events
                  } else if (r.getTriggerDeviceName() == null || rule.getTriggerDeviceName() == null) {
                    deviceMatches = false; // One is global, one is device-specific
                  } else {
                    deviceMatches = r.getTriggerDeviceName().equalsIgnoreCase(rule.getTriggerDeviceName());
                  }
                  
                  return eventMatches && deviceMatches;
                })
            .findFirst();

    if (conflict.isPresent()) {
      String deviceDescription = rule.getTriggerDeviceName() != null 
          ? "Device " + rule.getTriggerDeviceName()
          : "Global event";
      throw new RuleConflictException(
          "Conflict detected: " + deviceDescription
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

  /** Handles global events that are not tied to a specific device. */
  public void handleGlobalEvent(String eventType) {
    System.out.println("\nRuleEngine received global event: " + eventType);

    for (Rule rule : rules) {
      if (evaluateRule(rule, eventType, null)) {
        executeActions(rule);
      }
    }
  }

  /** Evaluates a single rule. */
  private boolean evaluateRule(Rule rule, String eventType, String deviceName) {
    // Check if event type matches
    boolean eventMatches = rule.getTriggerEvent().equalsIgnoreCase(eventType);
    
    // Check if device matches (handle global events with null device names)
    boolean deviceMatches;
    if (rule.getTriggerDeviceName() == null) {
      // Global event - device name should also be null or match global event pattern
      deviceMatches = (deviceName == null);
    } else {
      // Device-specific event
      deviceMatches = rule.getTriggerDeviceName().equalsIgnoreCase(deviceName);
    }
    
    // Check time constraints using Rule's actual time window
    boolean timeMatches = rule.isActiveNow(LocalTime.now());

    return eventMatches && deviceMatches && timeMatches;
  }

  /** Executes the target scene and sends notification. */
  private void executeActions(Rule rule) {
    Scene targetScene = rule.getTargetScene();

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

    // Send notification about the triggered rule
    String notificationMessage;
    if (rule.isDeviceSpecific()) {
      // Device-specific rule
      Device triggeredDevice = homeManager.getDevicebyName(rule.getTriggerDeviceName());
      Room room = null;
      if (triggeredDevice != null) {
        room = homeManager.getRooms().stream()
            .filter(r -> r.getDevices().contains(triggeredDevice))
            .findFirst()
            .orElse(null);
      }
      
      String roomName = room != null ? room.getRoomName() : "Unknown";
      notificationMessage = String.format("ALERT: %s triggered by %s in %s", 
          rule.getTriggerEvent(), rule.getTriggerDeviceName(), roomName);
    } else {
      // Global event rule
      notificationMessage = String.format("ALERT: Global event %s triggered scene %s", 
          rule.getTriggerEvent(), targetScene.getName());
    }
    
    notificationService.sendAlert(notificationMessage);
  }

}

package com.smarthome.devices;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.exceptions.RuleConflictException;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Evaluates rules and triggers scenes and notifications.
 */
public class RuleEngine {

    private final HomeManager homeManager;
    private final NotificationService notificationService;
    private final List<Rule> rules;

    public RuleEngine(HomeManager homeManager, NotificationService notificationService) {
        this.homeManager = homeManager;
        this.notificationService = notificationService;
        this.rules = new ArrayList<>();
    }

    /**
     * Adds a rule if it does not conflict with existing rules.
     */
    public void addRule(Rule rule) throws RuleConflictException {
        // Check for conflicts: same device + same event
        Optional<Rule> conflict = rules.stream()
            .filter(r -> r.getTriggerDeviceId().equals(rule.getTriggerDeviceId())
                    && r.getTriggerEvent().equalsIgnoreCase(rule.getTriggerEvent()))
            .findFirst();

        if (conflict.isPresent()) {
            throw new RuleConflictException(
                "Conflict detected: Device " + rule.getTriggerDeviceId() +
                " already has a rule for event " + rule.getTriggerEvent()
            );
        }

        rules.add(rule);
    }

    /**
     * Handles an incoming event from a device.
     */
    public void handleEvent(String eventType, String deviceId) {
        System.out.println("\nRuleEngine received event: " + eventType + " from " + deviceId);

        for (Rule rule : rules) {
            if (evaluateRule(rule, eventType, deviceId)) {
                executeActions(rule);
            }
        }
    }

    /**
     * Evaluates a single rule.
     */
    private boolean evaluateRule(Rule rule, String eventType, String deviceId) {
        boolean eventMatches = rule.getTriggerEvent().equalsIgnoreCase(eventType)
                               && rule.getTriggerDeviceId().equals(deviceId);

        // Example: only trigger after 11 PM
        boolean timeMatches = LocalTime.now().isAfter(LocalTime.of(23, 0));

        return eventMatches && timeMatches;
    }

    /**
     * Executes the target scene and sends notification.
     */
    private void executeActions(Rule rule) {
        // Execute target scene
        Scene targetScene = homeManager.getSceneManager().getScene(rule.getTargetSceneName());

        if (targetScene != null) {
            System.out.println("Executing Scene: " + targetScene.getName());
            for (Action a : targetScene.getActions()) {
                // Find the device by name
                var device = homeManager.getDevicebyName(a.getDeviceName());
                if (device != null) {
                    try {
                        homeManager.sendCommand(device, a.getCommand(), a.getValue());
                    } catch (Exception e) {
                        System.err.println("Failed to execute action on device " + device.getDeviceName());
                    }
                }
            }
        } else {
            System.err.println("ERROR: Scene not found: " + rule.getTargetSceneName());
        }

        // Send notification with room lookup
        var triggeredDevice = homeManager.getDevicebyName(rule.getTriggerDeviceId());
        Room room = homeManager.getRooms().stream()
                        .filter(r -> r.getDevices().contains(triggeredDevice))
                        .findFirst()
                        .orElse(null);

        String roomName = room != null ? room.getRoomName() : "Unknown";
        notificationService.sendAlert("ALERT: Motion detected after 11 PM in " + roomName);
    }
}

package com.smarthome.devices;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class RuleEngine {
    private final HomeManager homeManager;
    private final NotificationService notificationService;
    private final List<Rule> rules;

    // The RuleEngine needs access to the HomeManager and NotificationService to act.
    public RuleEngine(HomeManager homeManager, NotificationService notificationService) {
        this.homeManager = homeManager;
        this.notificationService = notificationService;
        this.rules = new ArrayList<>();
    }

    public void addRule(Rule rule) {
        this.rules.add(rule);
    }

    /**
     * The core method: Triggers when an event (like motion) occurs.
     * @param eventType The type of event (e.g., "MOTION_DETECTED")
     * @param deviceId The ID of the device that reported the event.
     */
    public void handleEvent(String eventType, String deviceId) {
        System.out.println("\nRuleEngine received event: " + eventType + " from " + deviceId);
        
        // Iterate through all registered rules and evaluate them
        for (Rule rule : rules) {
            if (evaluateRule(rule, eventType, deviceId)) {
                executeActions(rule);
            }
        }
    }

    /**
     * Evaluates a single rule's conditions.
     */
    private boolean evaluateRule(Rule rule, String eventType, String deviceId) {
        // Condition 1: Check the event type and source
        boolean eventMatches = rule.getTriggerEvent().equalsIgnoreCase(eventType) 
                               && rule.getTriggerDeviceId().equals(deviceId);

        // Condition 2: Check time (assuming the rule checks for 'after 11 PM')
        LocalTime now = LocalTime.now();
        boolean timeMatches = now.isAfter(LocalTime.of(23, 0)); 

        // For Story 3, both conditions must be met
        return eventMatches && timeMatches;
    }

    /**
     * Executes the actions defined in the rule's target scene.
     */
    private void executeActions(Rule rule) {
        // Step 1: Execute the actions (e.g., turn on hallway lights)
        Scene targetScene = homeManager.getSceneManager().getScene(rule.getTargetSceneName());
        
        if (targetScene != null) {
            System.out.println("Executing Scene: " + targetScene.getName());
            // In a real implementation, you would loop through targetScene.getActions()
            // and tell the HomeManager to execute each one.
            homeManager.getSceneManager().runScene(targetScene.getName()); 
        } else {
            // This is where you would throw a DeviceNotFoundException/SceneNotFoundException 
            System.err.println("ERROR: Target scene not found for rule.");
        }

        // Step 2: Trigger the notification (e.g., send me an alert)
        notificationService.sendAlert("ALERT: Motion detected after 11 PM in the " + homeManager.getDevice(rule.getTriggerDeviceId()).getRoom());
    }
}
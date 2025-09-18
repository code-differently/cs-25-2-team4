package com.smarthome.devices;

public class Rule extends com.smarthome.rules.Rule {
    public Rule(String triggerEvent, String triggerDeviceId, String targetSceneName,
                java.time.LocalTime startAfter, java.time.LocalTime endBefore) {
        super(triggerEvent, triggerDeviceId, targetSceneName, startAfter, endBefore);
    }
    public Rule(String triggerEvent, String triggerDeviceId, String targetSceneName) {
        super(triggerEvent, triggerDeviceId, targetSceneName);
    }
}

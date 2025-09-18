package com.smarthome.devices;

import java.time.LocalTime;

public class Rule {
    private final String triggerEvent;
    private final String triggerDeviceId;
    private final String targetSceneName;
    private final LocalTime startAfter;
    private final LocalTime endBefore;

    public Rule(String triggerEvent, String triggerDeviceId, String targetSceneName, LocalTime startAfter, LocalTime endBefore) {
        this.triggerEvent = triggerEvent;
        this.triggerDeviceId = triggerDeviceId;
        this.targetSceneName = targetSceneName;
        this.startAfter = startAfter;
        this.endBefore = endBefore;
    }

    public Rule(String triggerEvent, String triggerDeviceId, String targetSceneName) {
        this(triggerEvent, triggerDeviceId, targetSceneName, null, null);
    }

    public String getTriggerEvent() { return triggerEvent; }
    public String getTriggerDeviceId() { return triggerDeviceId; }
    public String getTargetSceneName() { return targetSceneName; }
    public LocalTime getStartAfter() { return startAfter; }
    public LocalTime getEndBefore() { return endBefore; }

    public boolean isActiveNow(LocalTime now) {
        if (startAfter != null && now.isBefore(startAfter)) return false;
        if (endBefore != null && now.isAfter(endBefore)) return false;
        return true;
    }
}

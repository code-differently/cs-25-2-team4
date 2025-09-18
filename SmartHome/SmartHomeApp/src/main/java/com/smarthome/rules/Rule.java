package com.smarthome.rules;

import java.time.LocalTime;
import java.util.Objects;

public class Rule {
    private final String triggerEvent;
    private final String triggerDeviceId;
    private final String targetSceneName;
    private final LocalTime startAfter;
    private final LocalTime endBefore;

    public Rule(
        String triggerEvent,
        String triggerDeviceId,
        String targetSceneName,
        LocalTime startAfter,
        LocalTime endBefore
    ) {
        this.triggerEvent = Objects.requireNonNull(triggerEvent, "triggerEvent cannot be null");
        this.triggerDeviceId = Objects.requireNonNull(triggerDeviceId, "triggerDeviceId cannot be null");
        this.targetSceneName = Objects.requireNonNull(targetSceneName, "targetSceneName cannot be null");
        this.startAfter = startAfter;
        this.endBefore = endBefore;
        if (startAfter != null && endBefore != null && endBefore.isBefore(startAfter)) {
            throw new IllegalArgumentException("endBefore must be after startAfter");
        }
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Rule)) return false;
        Rule rule = (Rule) o;
        return triggerEvent.equals(rule.triggerE

mkdir -p SmartHome/SmartHomeApp/src/main/java/com/smarthome/devices
cat > SmartHome/SmartHomeApp/src/main/java/com/smarthome/devices/Rule.java <<'EOF'
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

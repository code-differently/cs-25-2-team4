package com.smarthome.scene;

import java.time.LocalTime;
import java.util.Objects;

public class Rule {
  private final String triggerEvent;
  private final String triggerDeviceName;
  private final Scene targetScene;

  private final LocalTime startAfter;
  private final LocalTime endBefore;

  public Rule(
      String triggerEvent,
      String triggerDeviceName,
      Scene targetScene,
      LocalTime startAfter,
      LocalTime endBefore) {
    this.triggerEvent = Objects.requireNonNull(triggerEvent, "triggerEvent cannot be null");
    this.triggerDeviceName = triggerDeviceName;
    this.targetScene = Objects.requireNonNull(targetScene, "targetScene cannot be null");
    this.startAfter = startAfter;
    this.endBefore = endBefore;
  }

  public Rule(String triggerEvent, String triggerDeviceName, Scene targetScene) {
    this(triggerEvent, triggerDeviceName, targetScene, null, null);
  }

  // Convenience constructor for global events without specific device
  public Rule(String triggerEvent, Scene targetScene) {
    this(triggerEvent, null, targetScene, null, null);
  }

  // Convenience constructor for global events with time constraints
  public Rule(String triggerEvent, Scene targetScene, LocalTime startAfter, LocalTime endBefore) {
    this(triggerEvent, null, targetScene, startAfter, endBefore);
  }

  public String getTriggerEvent() {
    return triggerEvent;
  }

  public String getTriggerDeviceName() {
    return triggerDeviceName;
  }

  public Scene getTargetScene() {
    return targetScene;
  }

  public LocalTime getStartAfter() {
    return startAfter;
  }

  public LocalTime getEndBefore() {
    return endBefore;
  }

  public boolean isDeviceSpecific() {
    return triggerDeviceName != null;
  }

  public boolean isActiveNow(LocalTime now) {
    // Handle case where no time constraints are set
    if (startAfter == null && endBefore == null) return true;
    if (startAfter == null) return !now.isAfter(endBefore);
    if (endBefore == null) return !now.isBefore(startAfter);
    // Check if time window crosses midnight (e.g., 23:00 to 02:00)
    if (endBefore.isBefore(startAfter)) {
      // Overnight window: active if after startAfter OR before endBefore
      return !now.isBefore(startAfter) || !now.isAfter(endBefore);
    } else {
      // Same-day window: active if between startAfter and endBefore
      return !now.isBefore(startAfter) && !now.isAfter(endBefore);
    }
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Rule)) return false;
    Rule rule = (Rule) o;
    return triggerEvent.equals(rule.triggerEvent)
        && java.util.Objects.equals(triggerDeviceName, rule.triggerDeviceName)
        && targetScene.equals(rule.targetScene)
        && java.util.Objects.equals(startAfter, rule.startAfter)
        && java.util.Objects.equals(endBefore, rule.endBefore);
  }

  @Override
  public int hashCode() {
    return java.util.Objects.hash(
        triggerEvent, triggerDeviceName, targetScene, startAfter, endBefore);
  }

  @Override
  public String toString() {

    String deviceName =
        (triggerDeviceName != null ? "triggerDeviceName='" + triggerDeviceName + '\'' : "");

    return "Rule{"
        + "triggerEvent='"
        + triggerEvent
        + '\''
        + deviceName
        + '\''
        + ", targetScene='"
        + targetScene.getName()
        + '\''
        + ", startAfter="
        + startAfter
        + ", endBefore="
        + endBefore
        + '}';
  }
}

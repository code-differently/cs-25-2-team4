package com.smarthome.scene;

import java.time.LocalTime;
import java.util.Objects;

public class Rule {
  private final String triggerEvent;
  private final String triggerDeviceName;
  private final String targetSceneName;
  private final LocalTime startAfter;
  private final LocalTime endBefore;

  public Rule(
      String triggerEvent,
      String triggerDeviceName,
      String targetSceneName,
      LocalTime startAfter,
      LocalTime endBefore) {
    this.triggerEvent = Objects.requireNonNull(triggerEvent, "triggerEvent cannot be null");
    this.triggerDeviceName =
        Objects.requireNonNull(triggerDeviceName, "triggerDeviceName cannot be null");
    this.targetSceneName =
        Objects.requireNonNull(targetSceneName, "targetSceneName cannot be null");
    this.startAfter = startAfter;
    this.endBefore = endBefore;
    if (startAfter != null && endBefore != null && endBefore.isBefore(startAfter)) {
      throw new IllegalArgumentException("endBefore must be after startAfter");
    }
  }

  public Rule(String triggerEvent, String triggerDeviceName, String targetSceneName) {
    this(triggerEvent, triggerDeviceName, targetSceneName, null, null);
  }

  public String getTriggerEvent() {
    return triggerEvent;
  }

  public String getTriggerDeviceName() {
    return triggerDeviceName;
  }

  public String getTargetSceneName() {
    return targetSceneName;
  }

  public LocalTime getStartAfter() {
    return startAfter;
  }

  public LocalTime getEndBefore() {
    return endBefore;
  }

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
    return triggerEvent.equals(rule.triggerEvent)
        && triggerDeviceName.equals(rule.triggerDeviceName)
        && targetSceneName.equals(rule.targetSceneName)
        && java.util.Objects.equals(startAfter, rule.startAfter)
        && java.util.Objects.equals(endBefore, rule.endBefore);
  }

  @Override
  public int hashCode() {
    return java.util.Objects.hash(
        triggerEvent, triggerDeviceName, targetSceneName, startAfter, endBefore);
  }

  @Override
  public String toString() {
    return "Rule{"
        + "triggerEvent='"
        + triggerEvent
        + '\''
        + ", triggerDeviceName='"
        + triggerDeviceName
        + '\''
        + ", targetSceneName='"
        + targetSceneName
        + '\''
        + ", startAfter="
        + startAfter
        + ", endBefore="
        + endBefore
        + '}';
  }
}

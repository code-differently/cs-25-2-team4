package com.smarthome.rules;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.scene.Rule;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;

public class RuleTest {

  @Test
  void testRuleCreation() {
    Rule rule = new Rule("MOTION_DETECTED", "dev1", "NightScene", 
                        LocalTime.of(23, 0), LocalTime.of(23, 59));
    
    assertEquals("MOTION_DETECTED", rule.getTriggerEvent());
    assertEquals("dev1", rule.getTriggerDeviceName());
    assertEquals("NightScene", rule.getTargetSceneName());
  }

  @Test
  void testSameDayTimeWindow() {
    Rule rule = new Rule("MOTION_DETECTED", "dev1", "NightScene", 
                        LocalTime.of(23, 0), LocalTime.of(23, 59));
    
    // Should be active during the time window
    assertTrue(rule.isActiveNow(LocalTime.of(23, 30)));
    
    // Should be inactive outside the time window  
    assertFalse(rule.isActiveNow(LocalTime.of(0, 0)));
  }

  @Test
  void testOvernightTimeWindow() {
    // Rule active from 11 PM to 2 AM (crosses midnight)
    Rule rule = new Rule("MOTION_DETECTED", "camera1", "NightMode", 
                        LocalTime.of(23, 0), LocalTime.of(2, 0));
    
    // Should be active late night
    assertTrue(rule.isActiveNow(LocalTime.of(23, 30)));
    
    // Should be active early morning
    assertTrue(rule.isActiveNow(LocalTime.of(1, 30)));
    
    // Should be inactive during day
    assertFalse(rule.isActiveNow(LocalTime.of(12, 0)));
  }

  @Test
  void testNoTimeConstraints() {
    Rule rule = new Rule("DOOR_OPENED", "frontDoor", "WelcomeScene");
    
    // Should be active at any time when no constraints
    assertTrue(rule.isActiveNow(LocalTime.of(0, 0)));
    assertTrue(rule.isActiveNow(LocalTime.of(12, 0)));
    assertTrue(rule.isActiveNow(LocalTime.of(23, 59)));
  }

  @Test
  void testNullValidation() {
    // Should throw exception for null parameters
    assertThrows(NullPointerException.class, () -> {
      new Rule(null, "device1", "scene1");
    });
    
    assertThrows(NullPointerException.class, () -> {
      new Rule("EVENT", null, "scene1");
    });
    
    assertThrows(NullPointerException.class, () -> {
      new Rule("EVENT", "device1", null);
    });
  }
}

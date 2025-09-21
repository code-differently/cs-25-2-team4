package com.smarthome.rules;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.scene.Rule;
import com.smarthome.scene.Scene;

import java.time.LocalTime;
import org.junit.jupiter.api.Test;

public class RuleTest {

  @Test
  void testRuleCreation() {
    Scene nightScene = new Scene("NightScene");
    Rule rule = new Rule("MOTION_DETECTED", "dev1", nightScene, 
                        LocalTime.of(23, 0), LocalTime.of(23, 59));
    
    assertEquals("MOTION_DETECTED", rule.getTriggerEvent());
    assertEquals("dev1", rule.getTriggerDeviceName());
    assertEquals(nightScene, rule.getTargetScene());
    assertEquals("NightScene", rule.getTargetScene().getName());
  }

  @Test
  void testSameDayTimeWindow() {
    Scene nightScene = new Scene("NightScene");
    Rule rule = new Rule("MOTION_DETECTED", "dev1", nightScene, 
                        LocalTime.of(23, 0), LocalTime.of(23, 59));
    
    // Should be active during the time window
    assertTrue(rule.isActiveNow(LocalTime.of(23, 30)));
    
    // Should be inactive outside the time window  
    assertFalse(rule.isActiveNow(LocalTime.of(0, 0)));
  }

  @Test
  void testOvernightTimeWindow() {
    // Rule active from 11 PM to 2 AM (crosses midnight)
    Scene nightMode = new Scene("NightMode");
    Rule rule = new Rule("MOTION_DETECTED", "camera1", nightMode, 
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
    Scene welcomeScene = new Scene("WelcomeScene");
    Rule rule = new Rule("DOOR_OPENED", "frontDoor", welcomeScene);
    
    // Should be active at any time when no constraints
    assertTrue(rule.isActiveNow(LocalTime.of(0, 0)));
    assertTrue(rule.isActiveNow(LocalTime.of(12, 0)));
    assertTrue(rule.isActiveNow(LocalTime.of(23, 59)));
  }

  @Test
  void testNullValidation() {
    Scene testScene = new Scene("TestScene");
    
    // Should throw exception for null triggerEvent and targetScene
    assertThrows(NullPointerException.class, () -> {
      new Rule(null, "device1", testScene);
    });
    
    assertThrows(NullPointerException.class, () -> {
      new Rule("EVENT", "device1", null);
    });
    
    // triggerDeviceName can now be null (global events)
    assertDoesNotThrow(() -> {
      new Rule("TIMER_EVENT", null, testScene);
    });
  }

  @Test
  void testGlobalEventRule() {
    Scene morningScene = new Scene("MorningScene");
    
    // Test rule without device (global event)
    Rule globalRule = new Rule("SUNRISE", morningScene);
    
    assertEquals("SUNRISE", globalRule.getTriggerEvent());
    assertNull(globalRule.getTriggerDeviceName());
    assertEquals(morningScene, globalRule.getTargetScene());
    assertFalse(globalRule.isDeviceSpecific());
  }

  @Test
  void testGlobalEventRuleWithTimeConstraints() {
    Scene nightScene = new Scene("NightScene");
    
    // Test global rule with time constraints
    Rule timedGlobalRule = new Rule("MIDNIGHT_TIMER", nightScene, 
                                   LocalTime.of(23, 0), LocalTime.of(1, 0));
    
    assertEquals("MIDNIGHT_TIMER", timedGlobalRule.getTriggerEvent());
    assertNull(timedGlobalRule.getTriggerDeviceName());
    assertEquals(nightScene, timedGlobalRule.getTargetScene());
    assertFalse(timedGlobalRule.isDeviceSpecific());
    
    // Test time constraints
    assertTrue(timedGlobalRule.isActiveNow(LocalTime.of(23, 30)));
    assertTrue(timedGlobalRule.isActiveNow(LocalTime.of(0, 30)));
    assertFalse(timedGlobalRule.isActiveNow(LocalTime.of(12, 0)));
  }

  @Test
  void testDeviceSpecificCheck() {
    Scene testScene = new Scene("TestScene");
    
    // Device-specific rule
    Rule deviceRule = new Rule("MOTION_DETECTED", "sensor1", testScene);
    assertTrue(deviceRule.isDeviceSpecific());
    
    // Global rule
    Rule globalRule = new Rule("TIMER_EVENT", testScene);
    assertFalse(globalRule.isDeviceSpecific());
  }
}

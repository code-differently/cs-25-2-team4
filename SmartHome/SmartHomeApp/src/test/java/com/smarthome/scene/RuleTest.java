package com.smarthome.scene;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalTime;
import org.junit.jupiter.api.Test;

public class RuleTest {

  @Test
  void testRuleCreation() {
    Scene nightScene = new Scene("NightScene");
    Rule rule =
        new Rule("MOTION_DETECTED", "dev1", nightScene, LocalTime.of(23, 0), LocalTime.of(23, 59));

    assertEquals("MOTION_DETECTED", rule.getTriggerEvent());
    assertEquals("dev1", rule.getTriggerDeviceName());
    assertEquals(nightScene, rule.getTargetScene());
    assertEquals("NightScene", rule.getTargetScene().getName());
  }

  @Test
  void testSameDayTimeWindow() {
    Scene nightScene = new Scene("NightScene");
    Rule rule =
        new Rule("MOTION_DETECTED", "dev1", nightScene, LocalTime.of(23, 0), LocalTime.of(23, 59));

    // Should be active during the time window
    assertTrue(rule.isActiveNow(LocalTime.of(23, 30)));

    // Should be inactive outside the time window
    assertFalse(rule.isActiveNow(LocalTime.of(0, 0)));
  }

  @Test
  void testOvernightTimeWindow() {
    // Rule active from 11 PM to 2 AM (crosses midnight)
    Scene nightMode = new Scene("NightMode");
    Rule rule =
        new Rule("MOTION_DETECTED", "camera1", nightMode, LocalTime.of(23, 0), LocalTime.of(2, 0));

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
    assertThrows(
        NullPointerException.class,
        () -> {
          new Rule(null, "device1", testScene);
        });

    assertThrows(
        NullPointerException.class,
        () -> {
          new Rule("EVENT", "device1", null);
        });

    // triggerDeviceName can now be null (global events)
    assertDoesNotThrow(
        () -> {
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
    Rule timedGlobalRule =
        new Rule("MIDNIGHT_TIMER", nightScene, LocalTime.of(23, 0), LocalTime.of(1, 0));

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

  @Test
  void testRuleEquals() {
    Scene scene1 = new Scene("Scene1");
    Scene scene2 = new Scene("Scene2");
    
    Rule rule1 = new Rule("MOTION_DETECTED", "sensor1", scene1, LocalTime.of(23, 0), LocalTime.of(2, 0));
    Rule rule2 = new Rule("MOTION_DETECTED", "sensor1", scene1, LocalTime.of(23, 0), LocalTime.of(2, 0));
    Rule rule3 = new Rule("TEMPERATURE_CHANGE", "sensor1", scene1, LocalTime.of(23, 0), LocalTime.of(2, 0));
    Rule rule4 = new Rule("MOTION_DETECTED", "sensor2", scene1, LocalTime.of(23, 0), LocalTime.of(2, 0));
    Rule rule5 = new Rule("MOTION_DETECTED", "sensor1", scene2, LocalTime.of(23, 0), LocalTime.of(2, 0));
    Rule rule6 = new Rule("MOTION_DETECTED", "sensor1", scene1, LocalTime.of(22, 0), LocalTime.of(2, 0));
    Rule rule7 = new Rule("MOTION_DETECTED", "sensor1", scene1, LocalTime.of(23, 0), LocalTime.of(3, 0));
    
    // Test reflexivity
    assertTrue(rule1.equals(rule1));
    
    // Test symmetry and equality
    assertTrue(rule1.equals(rule2));
    assertTrue(rule2.equals(rule1));
    
    // Test inequality for different trigger events
    assertFalse(rule1.equals(rule3));
    
    // Test inequality for different device names
    assertFalse(rule1.equals(rule4));
    
    // Test inequality for different target scenes
    assertFalse(rule1.equals(rule5));
    
    // Test inequality for different start times
    assertFalse(rule1.equals(rule6));
    
    // Test inequality for different end times
    assertFalse(rule1.equals(rule7));
    
    // Test inequality with null
    assertFalse(rule1.equals(null));
    
    // Test inequality with different class
    assertFalse(rule1.equals("not a rule"));
  }

  @Test
  void testRuleHashCode() {
    Scene scene = new Scene("TestScene");
    Rule rule1 = new Rule("MOTION_DETECTED", "sensor1", scene, LocalTime.of(23, 0), LocalTime.of(2, 0));
    Rule rule2 = new Rule("MOTION_DETECTED", "sensor1", scene, LocalTime.of(23, 0), LocalTime.of(2, 0));
    
    // Equal objects should have equal hash codes
    assertEquals(rule1.hashCode(), rule2.hashCode());
    
    // Test that hashCode is consistent
    int hashCode1 = rule1.hashCode();
    int hashCode2 = rule1.hashCode();
    assertEquals(hashCode1, hashCode2);
  }

  @Test
  void testRuleToString() {
    Scene scene = new Scene("TestScene");
    Rule rule = new Rule("MOTION_DETECTED", "sensor1", scene, LocalTime.of(23, 0), LocalTime.of(2, 0));
    
    String toString = rule.toString();
    assertNotNull(toString);
    assertTrue(toString.contains("MOTION_DETECTED"));
    assertTrue(toString.contains("sensor1"));
    assertTrue(toString.contains("TestScene"));
    assertTrue(toString.contains("23:00"));
    assertTrue(toString.contains("02:00"));
  }

  @Test
  void testRuleWithNullDeviceName() {
    Scene scene = new Scene("TestScene");
    Rule rule = new Rule("MOTION_DETECTED", null, scene, LocalTime.of(23, 0), LocalTime.of(2, 0));
    
    // Should handle null device name gracefully
    assertNull(rule.getTriggerDeviceName());
    assertFalse(rule.isDeviceSpecific()); // null device name means not device-specific
    
    // toString should handle null device name gracefully (empty deviceName section)
    String toString = rule.toString();
    assertNotNull(toString);
    assertFalse(toString.contains("triggerDeviceName=")); // Should not include device name section when null
  }

  @Test
  void testRuleEqualsWithNullFields() {
    Scene scene = new Scene("TestScene");
    Rule rule1 = new Rule("MOTION_DETECTED", null, scene, null, null);
    Rule rule2 = new Rule("MOTION_DETECTED", null, scene, null, null);
    Rule rule3 = new Rule("MOTION_DETECTED", "sensor1", scene, null, null);
    
    // Rules with same null fields should be equal
    assertTrue(rule1.equals(rule2));
    
    // Rules with different null/non-null fields should not be equal
    assertFalse(rule1.equals(rule3));
  }
}

package com.smarthome.scene;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.exceptions.RuleConflictException;
import java.time.LocalTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RuleEngineTest {

  private TestSceneManager sceneManager;
  private Scene mockScene;
  private RuleEngine ruleEngine;

  @BeforeEach
  void setUp() {
    sceneManager = new TestSceneManager();
    mockScene = new Scene("TestScene");
    ruleEngine = new RuleEngine(sceneManager, new ConsoleNotificationService());
  }

  @Test
  void testConstructor() {
    RuleEngine engine = new RuleEngine(sceneManager, new ConsoleNotificationService());
    assertNotNull(engine);
  }

  @Test
  void testAddRule_Success() throws RuleConflictException {
    Rule rule = new Rule("motion_detected", "MotionSensor1", mockScene);
    assertDoesNotThrow(() -> ruleEngine.addRule(rule));
  }

  @Test
  void testAddRule_ConflictThrowsException() throws RuleConflictException {
    Rule existingRule = new Rule("motion_detected", "MotionSensor1", mockScene);
    Rule conflictingRule = new Rule("MOTION_DETECTED", "motionsensor1", mockScene);

    ruleEngine.addRule(existingRule);

    RuleConflictException exception =
        assertThrows(RuleConflictException.class, () -> ruleEngine.addRule(conflictingRule));

    assertTrue(exception.getMessage().contains("Conflict detected"));
    assertTrue(exception.getMessage().contains("motionsensor1"));
    assertTrue(exception.getMessage().contains("MOTION_DETECTED"));
  }

  @Test
  void testAddRule_DifferentDeviceSameEvent_NoConflict() throws RuleConflictException {
    Rule rule1 = new Rule("motion_detected", "MotionSensor1", mockScene);
    Rule rule2 = new Rule("motion_detected", "MotionSensor2", mockScene);

    assertDoesNotThrow(
        () -> {
          ruleEngine.addRule(rule1);
          ruleEngine.addRule(rule2);
        });
  }

  @Test
  void testAddRule_SameDeviceDifferentEvent_NoConflict() throws RuleConflictException {
    Rule rule1 = new Rule("motion_detected", "MotionSensor1", mockScene);
    Rule rule2 = new Rule("motion_stopped", "MotionSensor1", mockScene);

    assertDoesNotThrow(
        () -> {
          ruleEngine.addRule(rule1);
          ruleEngine.addRule(rule2);
        });
  }

  @Test
  void testAddRule_GlobalEvents_NoConflict() throws RuleConflictException {
    Rule globalRule1 = new Rule("sunset", mockScene);
    Rule globalRule2 = new Rule("sunrise", mockScene);

    assertDoesNotThrow(
        () -> {
          ruleEngine.addRule(globalRule1);
          ruleEngine.addRule(globalRule2);
        });
  }

  @Test
  void testAddRule_GlobalEventConflict_ThrowsException() throws RuleConflictException {
    Rule globalRule1 = new Rule("sunset", mockScene);
    Rule globalRule2 = new Rule("SUNSET", mockScene);

    ruleEngine.addRule(globalRule1);

    RuleConflictException exception =
        assertThrows(RuleConflictException.class, () -> ruleEngine.addRule(globalRule2));

    assertTrue(exception.getMessage().contains("Global event"));
    assertTrue(exception.getMessage().contains("SUNSET"));
  }

  @Test
  void testRuleTimeConstraints() {
    LocalTime startTime = LocalTime.of(22, 0);
    LocalTime endTime = LocalTime.of(6, 0);
    Rule rule = new Rule("motion_detected", "MotionSensor1", mockScene, startTime, endTime);

    assertEquals("motion_detected", rule.getTriggerEvent());
    assertEquals("MotionSensor1", rule.getTriggerDeviceName());
    assertEquals(mockScene, rule.getTargetScene());
    assertEquals(startTime, rule.getStartAfter());
    assertEquals(endTime, rule.getEndBefore());
  }

  @Test
  void testGlobalRuleCreation() {
    Rule globalRule = new Rule("sunset", mockScene);

    assertEquals("sunset", globalRule.getTriggerEvent());
    assertNull(globalRule.getTriggerDeviceName());
    assertEquals(mockScene, globalRule.getTargetScene());
    assertFalse(globalRule.isDeviceSpecific());
  }

  @Test
  void testRuleIsActiveNow_NoTimeConstraints() {
    Rule rule = new Rule("motion_detected", "MotionSensor1", mockScene);
    assertTrue(rule.isActiveNow(LocalTime.now()));
  }

  @Test
  void testRuleIsActiveNow_SameDayWindow() {
    LocalTime startTime = LocalTime.of(9, 0); // 9 AM
    LocalTime endTime = LocalTime.of(17, 0); // 5 PM
    Rule rule = new Rule("motion_detected", "MotionSensor1", mockScene, startTime, endTime);

    assertTrue(rule.isActiveNow(LocalTime.of(12, 0))); // Noon - active
    assertFalse(rule.isActiveNow(LocalTime.of(8, 0))); // 8 AM - inactive
    assertFalse(rule.isActiveNow(LocalTime.of(18, 0))); // 6 PM - inactive
  }

  @Test
  void testRuleIsActiveNow_OvernightWindow() {
    LocalTime startTime = LocalTime.of(22, 0); // 10 PM
    LocalTime endTime = LocalTime.of(6, 0); // 6 AM (next day)
    Rule rule = new Rule("motion_detected", "MotionSensor1", mockScene, startTime, endTime);

    assertTrue(rule.isActiveNow(LocalTime.of(23, 0))); // 11 PM - active
    assertTrue(rule.isActiveNow(LocalTime.of(3, 0))); // 3 AM - active
    assertFalse(rule.isActiveNow(LocalTime.of(12, 0))); // Noon - inactive
    assertFalse(rule.isActiveNow(LocalTime.of(21, 0))); // 9 PM - inactive
  }

  @Test
  void testHandleEvent_ExecutesMatchingRule() throws RuleConflictException {
    Rule rule = new Rule("motion_detected", "MotionSensor1", mockScene);
    ruleEngine.addRule(rule);

    ruleEngine.handleEvent("motion_detected", "MotionSensor1");

    // Verify scene was executed
    assertTrue(sceneManager.wasSceneExecuted(mockScene));
    assertEquals(1, sceneManager.getExecutionCount());
  }

  @Test
  void testHandleEvent_NoMatchingRule() throws RuleConflictException {
    Rule rule = new Rule("motion_detected", "MotionSensor1", mockScene);
    ruleEngine.addRule(rule);

    ruleEngine.handleEvent("different_event", "MotionSensor1");

    // Verify no scene was executed
    assertFalse(sceneManager.wasSceneExecuted(mockScene));
    assertEquals(0, sceneManager.getExecutionCount());
  }

  @Test
  void testHandleGlobalEvent_ExecutesMatchingRule() throws RuleConflictException {
    Rule globalRule = new Rule("sunset", mockScene);
    ruleEngine.addRule(globalRule);

    ruleEngine.handleGlobalEvent("sunset");

    // Verify scene was executed
    assertTrue(sceneManager.wasSceneExecuted(mockScene));
    assertEquals(1, sceneManager.getExecutionCount());
  }

  @Test
  void testHandleGlobalEvent_NoMatchingRule() throws RuleConflictException {
    Rule globalRule = new Rule("sunset", mockScene);
    ruleEngine.addRule(globalRule);

    ruleEngine.handleGlobalEvent("sunrise");

    // Verify no scene was executed
    assertFalse(sceneManager.wasSceneExecuted(mockScene));
    assertEquals(0, sceneManager.getExecutionCount());
  }

  // Test helper classes
  private static class TestSceneManager extends SceneManager {
    private int executionCount = 0;
    private Scene lastExecutedScene = null;
    private TestHomeManager testHomeManager;

    public TestSceneManager() {
      super(null); // Will override getHomeManager
      this.testHomeManager = new TestHomeManager();
    }

    @Override
    public void executeScene(Scene scene) {
      executionCount++;
      lastExecutedScene = scene;
    }

    @Override
    public com.smarthome.app.HomeManager getHomeManager() {
      return testHomeManager;
    }

    public boolean wasSceneExecuted(Scene scene) {
      return scene.equals(lastExecutedScene);
    }

    public int getExecutionCount() {
      return executionCount;
    }
  }

  private static class TestHomeManager extends com.smarthome.app.HomeManager {
    public TestHomeManager() {
      super("test-account");
    }

    @Override
    public com.smarthome.devices.Device getDevicebyName(String deviceName) {
      // Return a mock device for testing purposes
      if ("MotionSensor1".equalsIgnoreCase(deviceName)) {
        return new TestDevice("sensor1", "MotionSensor1");
      }
      return null;
    }

    @Override
    public java.util.Set<com.smarthome.app.Room> getRooms() {
      java.util.Set<com.smarthome.app.Room> rooms = new java.util.HashSet<>();
      com.smarthome.app.Room testRoom = new com.smarthome.app.Room("TestRoom");
      testRoom.addDevice(new TestDevice("sensor1", "MotionSensor1"));
      rooms.add(testRoom);
      return rooms;
    }
  }

  private static class TestDevice extends com.smarthome.devices.Device {
    public TestDevice(String deviceId, String deviceName) {
      super(deviceId, deviceName);
    }

    @Override
    public String getStatus() {
      return "active";
    }
  }


  @Test
  void testRuleConflictExceptionConstructor() {
    // Test RuleConflictException constructor within context of RuleEngine operations
    RuleConflictException exception = new RuleConflictException("Test conflict message");
    assertEquals("Test conflict message", exception.getMessage());
  }
}

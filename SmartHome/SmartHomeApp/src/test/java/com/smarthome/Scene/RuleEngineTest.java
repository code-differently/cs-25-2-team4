package com.smarthome.scene;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.devices.Device;
import com.smarthome.exceptions.RuleConflictException;
import com.smarthome.rules.Rule;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RuleEngineTest {

  @Mock private HomeManager homeManager;

  @Mock private SceneManager sceneManager;

  @Mock private NotificationService notificationService;

  @Mock private Rule mockRule;

  @Mock private Scene mockScene;

  @Mock private Device mockDevice;

  @Mock private Room mockRoom;

  @Mock private Action mockAction;

  private RuleEngine ruleEngine;

  @BeforeEach
  void setUp() {
    ruleEngine = new RuleEngine(sceneManager, notificationService);
  }

  @Test
  void testConstructor() {
    // Test that constructor initializes properly
    RuleEngine engine = new RuleEngine(sceneManager, notificationService);
    assertNotNull(engine);
  }

  @Test
  void testAddRule_Success() throws RuleConflictException {
    // Arrange
    when(mockRule.getTriggerDeviceName()).thenReturn("MotionSensor1");
    when(mockRule.getTriggerEvent()).thenReturn("motion_detected");

    // Act & Assert
    assertDoesNotThrow(() -> ruleEngine.addRule(mockRule));
  }

  @Test
  void testAddRule_ConflictThrowsException() throws RuleConflictException {
    // Arrange
    Rule existingRule = mock(Rule.class);
    when(existingRule.getTriggerDeviceName()).thenReturn("MotionSensor1");
    when(existingRule.getTriggerEvent()).thenReturn("motion_detected");

    Rule conflictingRule = mock(Rule.class);
    when(conflictingRule.getTriggerDeviceName()).thenReturn("motionsensor1"); // Different case
    when(conflictingRule.getTriggerEvent()).thenReturn("MOTION_DETECTED"); // Different case

    // Act
    ruleEngine.addRule(existingRule);

    // Assert
    RuleConflictException exception =
        assertThrows(RuleConflictException.class, () -> ruleEngine.addRule(conflictingRule));

    assertTrue(exception.getMessage().contains("Conflict detected"));
    assertTrue(exception.getMessage().contains("motionsensor1"));
    assertTrue(exception.getMessage().contains("MOTION_DETECTED"));
  }

  @Test
  void testAddRule_DifferentDeviceSameEvent_NoConflict() throws RuleConflictException {
    // Arrange
    Rule rule1 = mock(Rule.class);
    when(rule1.getTriggerDeviceName()).thenReturn("MotionSensor1");
    when(rule1.getTriggerEvent()).thenReturn("motion_detected");

    Rule rule2 = mock(Rule.class);
    when(rule2.getTriggerDeviceName()).thenReturn("MotionSensor2");
    when(rule2.getTriggerEvent()).thenReturn("motion_detected");

    // Act & Assert
    assertDoesNotThrow(
        () -> {
          ruleEngine.addRule(rule1);
          ruleEngine.addRule(rule2);
        });
  }

  @Test
  void testAddRule_SameDeviceDifferentEvent_NoConflict() throws RuleConflictException {
    // Arrange
    Rule rule1 = mock(Rule.class);
    when(rule1.getTriggerDeviceName()).thenReturn("MotionSensor1");
    when(rule1.getTriggerEvent()).thenReturn("motion_detected");

    Rule rule2 = mock(Rule.class);
    when(rule2.getTriggerDeviceName()).thenReturn("MotionSensor1");
    when(rule2.getTriggerEvent()).thenReturn("motion_stopped");

    // Act & Assert
    assertDoesNotThrow(
        () -> {
          ruleEngine.addRule(rule1);
          ruleEngine.addRule(rule2);
        });
  }

  @Test
  void testHandleEvent_MatchingRuleAfter11PM_ExecutesActions() throws RuleConflictException {
    // Arrange
    setupMockRule("motion_detected", "MotionSensor1", "NightScene");
    setupMockScene("NightScene");
    setupMockDevice("MotionSensor1");
    setupMockRoom("Living Room");

    ruleEngine.addRule(mockRule);

    try (MockedStatic<LocalTime> mockedLocalTime = mockStatic(LocalTime.class)) {
      // Mock time to be after 11 PM
      mockedLocalTime.when(LocalTime::now).thenReturn(LocalTime.of(23, 30));

      // Act
      ruleEngine.handleEvent("motion_detected", "MotionSensor1");

      // Assert
      verify(sceneManager).getSceneByName("NightScene");
      verify(homeManager).sendCommand(eq(mockDevice), eq("turn_off"), eq("0"));
      verify(notificationService)
          .sendAlert(contains("ALERT: Motion detected after 11 PM in Living Room"));
    }
  }

  @Test
  void testHandleEvent_MatchingRuleBefore11PM_DoesNotExecute() throws RuleConflictException {
    // Arrange
    setupMockRule("motion_detected", "MotionSensor1", "NightScene");
    ruleEngine.addRule(mockRule);

    try (MockedStatic<LocalTime> mockedLocalTime = mockStatic(LocalTime.class)) {
      // Mock time to be before 11 PM
      mockedLocalTime.when(LocalTime::now).thenReturn(LocalTime.of(22, 30));

      // Act
      ruleEngine.handleEvent("motion_detected", "MotionSensor1");

      // Assert
      verify(sceneManager, never()).getSceneByName(anyString());
      verify(notificationService, never()).sendAlert(anyString());
    }
  }

  @Test
  void testHandleEvent_NoMatchingRule_DoesNotExecute() throws RuleConflictException {
    // Arrange
    setupMockRule("motion_detected", "MotionSensor1", "NightScene");
    ruleEngine.addRule(mockRule);

    try (MockedStatic<LocalTime> mockedLocalTime = mockStatic(LocalTime.class)) {
      mockedLocalTime.when(LocalTime::now).thenReturn(LocalTime.of(23, 30));

      // Act - Different event type
      ruleEngine.handleEvent("door_opened", "MotionSensor1");

      // Assert
      verify(sceneManager, never()).getSceneByName(anyString());
      verify(notificationService, never()).sendAlert(anyString());
    }
  }

  @Test
  void testHandleEvent_SceneNotFound_LogsError() throws RuleConflictException {
    // Arrange
    setupMockRule("motion_detected", "MotionSensor1", "NonExistentScene");
    setupMockDevice("MotionSensor1");
    setupMockRoom("Living Room");

    when(sceneManager.getSceneByName("NonExistentScene")).thenReturn(null);

    ruleEngine.addRule(mockRule);

    try (MockedStatic<LocalTime> mockedLocalTime = mockStatic(LocalTime.class)) {
      mockedLocalTime.when(LocalTime::now).thenReturn(LocalTime.of(23, 30));

      // Act
      ruleEngine.handleEvent("motion_detected", "MotionSensor1");

      // Assert
      verify(sceneManager).getSceneByName("NonExistentScene");
      verify(notificationService)
          .sendAlert(contains("ALERT: Motion detected after 11 PM in Living Room"));
      // Scene execution should be skipped, but notification should still be sent
    }
  }

  @Test
  void testHandleEvent_DeviceNotFound_HandlesGracefully() throws RuleConflictException {
    // Arrange
    setupMockRule("motion_detected", "NonExistentDevice", "NightScene");
    setupMockScene("NightScene");

    when(homeManager.getDevicebyName("NonExistentDevice")).thenReturn(null);
    when(homeManager.getRooms()).thenReturn(Collections.emptyList());

    ruleEngine.addRule(mockRule);

    try (MockedStatic<LocalTime> mockedLocalTime = mockStatic(LocalTime.class)) {
      mockedLocalTime.when(LocalTime::now).thenReturn(LocalTime.of(23, 30));

      // Act
      ruleEngine.handleEvent("motion_detected", "NonExistentDevice");

      // Assert
      verify(notificationService)
          .sendAlert(contains("ALERT: Motion detected after 11 PM in Unknown"));
    }
  }

  @Test
  void testHandleEvent_SendCommandThrowsException_HandlesGracefully() throws RuleConflictException {
    // Arrange
    setupMockRule("motion_detected", "MotionSensor1", "NightScene");
    setupMockScene("NightScene");
    setupMockDevice("MotionSensor1");
    setupMockRoom("Living Room");

    // Make sendCommand throw an exception
    when(homeManager.sendCommand(any(), any(), any()))
        .thenThrow(new RuntimeException("Device communication error"));

    ruleEngine.addRule(mockRule);

    try (MockedStatic<LocalTime> mockedLocalTime = mockStatic(LocalTime.class)) {
      mockedLocalTime.when(LocalTime::now).thenReturn(LocalTime.of(23, 30));

      // Act & Assert - Should not throw exception
      assertDoesNotThrow(() -> ruleEngine.handleEvent("motion_detected", "MotionSensor1"));

      verify(notificationService)
          .sendAlert(contains("ALERT: Motion detected after 11 PM in Living Room"));
    }
  }

  @Test
  void testHandleEvent_CaseInsensitiveMatching() throws RuleConflictException {
    // Arrange
    setupMockRule("MOTION_DETECTED", "MotionSensor1", "NightScene");
    setupMockScene("NightScene");
    setupMockDevice("MotionSensor1");
    setupMockRoom("Living Room");

    ruleEngine.addRule(mockRule);

    try (MockedStatic<LocalTime> mockedLocalTime = mockStatic(LocalTime.class)) {
      mockedLocalTime.when(LocalTime::now).thenReturn(LocalTime.of(23, 30));

      // Act - Use lowercase event and different case device name
      ruleEngine.handleEvent("motion_detected", "motionsensor1");

      // Assert
      verify(sceneManager).getSceneByName("NightScene");
      verify(notificationService).sendAlert(anyString());
    }
  }

  // Helper methods
  private void setupMockRule(String triggerEvent, String triggerDevice, String targetScene) {
    when(mockRule.getTriggerEvent()).thenReturn(triggerEvent);
    when(mockRule.getTriggerDeviceName()).thenReturn(triggerDevice);
    when(mockRule.getTargetSceneName()).thenReturn(targetScene);
  }

  private void setupMockScene(String sceneName) {
    when(sceneManager.getSceneByName(sceneName)).thenReturn(mockScene);
    when(mockScene.getName()).thenReturn(sceneName);
    when(mockScene.getActions()).thenReturn(Arrays.asList(mockAction));

    when(mockAction.getDeviceId()).thenReturn("device1");
    when(mockAction.getCommand()).thenReturn("turn_off");
    when(mockAction.getValue()).thenReturn("0");
  }

  private void setupMockDevice(String deviceName) {
    when(homeManager.getDevicebyName(deviceName)).thenReturn(mockDevice);
    when(mockDevice.getDeviceId()).thenReturn("device1");
  }

  private void setupMockRoom(String roomName) {
    when(mockRoom.getRoomName()).thenReturn(roomName);
    when(mockRoom.getDevices()).thenReturn(Arrays.asList(mockDevice));
    when(homeManager.getRooms()).thenReturn(Arrays.asList(mockRoom));
  }
}

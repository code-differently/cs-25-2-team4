package com.smarthome.scene;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.devices.Light;
import com.smarthome.devices.Thermostat;
import com.smarthome.exceptions.SceneExecutionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/** Unit tests for SceneManager class to improve coverage */
public class SceneManagerTest {

  private SceneManager sceneManager;
  private HomeManager homeManager;
  private Scene testScene;
  private Light light;
  private Thermostat thermostat;
  private Room room;

  @BeforeEach
  void setUp() {
    homeManager = new HomeManager("TestAccount");
    sceneManager = new SceneManager(homeManager);
    room = new Room("Test Room");
    homeManager.addRoom(room);

    light = new Light("L001", "Test Light");
    thermostat = new Thermostat("T001", "Test Thermostat");

    homeManager.addDevice(light, room);
    homeManager.addDevice(thermostat, room);

    testScene = new Scene("Test Scene");
    testScene.addAction(new Action("Test Light", "turnOn", null));
    testScene.addAction(new Action("Test Thermostat", "setTemp", "22.0"));
  }

  @Nested
  @DisplayName("SceneManager Basic Operations")
  class BasicOperations {

    @Test
    @DisplayName("Should get HomeManager reference")
    void testGetHomeManager() {
      assertSame(homeManager, sceneManager.getHomeManager());
    }

    @Test
    @DisplayName("Should add scene successfully")
    void testAddSceneSuccess() {
      assertTrue(sceneManager.addScene(testScene));
      assertEquals(testScene, sceneManager.getSceneByName("Test Scene"));
    }

    @Test
    @DisplayName("Should not add null scene")
    void testAddNullScene() {
      assertFalse(sceneManager.addScene(null));
    }

    @Test
    @DisplayName("Should not add scene with null name")
    void testAddSceneWithNullName() {
      Scene sceneWithNullName = new Scene(null);
      assertFalse(sceneManager.addScene(sceneWithNullName));
    }

    @Test
    @DisplayName("Should not add duplicate scene")
    void testAddDuplicateScene() {
      sceneManager.addScene(testScene);

      Scene duplicateScene = new Scene("Test Scene");
      assertFalse(sceneManager.addScene(duplicateScene));

      // Original scene should remain
      assertSame(testScene, sceneManager.getSceneByName("Test Scene"));
    }

    @Test
    @DisplayName("Should remove scene successfully")
    void testRemoveScene() {
      sceneManager.addScene(testScene);
      assertTrue(sceneManager.removeScene("Test Scene"));
      assertNull(sceneManager.getSceneByName("Test Scene"));
    }

    @Test
    @DisplayName("Should return false when removing non-existent scene")
    void testRemoveNonExistentScene() {
      assertFalse(sceneManager.removeScene("Non-existent Scene"));
    }

    @Test
    @DisplayName("Should return unmodifiable collection of scenes")
    void testGetScenes() {
      sceneManager.addScene(testScene);

      var scenes = sceneManager.getScenes();
      assertTrue(scenes.contains(testScene));

      // Should be unmodifiable
      assertThrows(UnsupportedOperationException.class, () -> scenes.clear());
    }
  }

  @Nested
  @DisplayName("Scene Execution")
  class SceneExecution {

    @Test
    @DisplayName("Should execute scene by name successfully")
    void testExecuteSceneByName() throws SceneExecutionException {
      sceneManager.addScene(testScene);

      // Should not throw exception
      assertDoesNotThrow(() -> sceneManager.executeScene("Test Scene"));

      // Verify devices were affected
      assertTrue(light.isOn());
      assertEquals(22.0, thermostat.getTemp());
    }

    @Test
    @DisplayName("Should throw exception for non-existent scene name")
    void testExecuteNonExistentScene() {
      SceneExecutionException exception =
          assertThrows(
              SceneExecutionException.class, () -> sceneManager.executeScene("Non-existent Scene"));
      assertEquals("Scene not found: Non-existent Scene", exception.getMessage());
    }

    @Test
    @DisplayName("Should execute scene object successfully")
    void testExecuteSceneObject() throws SceneExecutionException {
      assertDoesNotThrow(() -> sceneManager.executeScene(testScene));

      // Verify devices were affected
      assertTrue(light.isOn());
      assertEquals(22.0, thermostat.getTemp());
    }

    @Test
    @DisplayName("Should throw exception for null scene object")
    void testExecuteNullScene() {
      SceneExecutionException exception =
          assertThrows(
              SceneExecutionException.class, () -> sceneManager.executeScene((Scene) null));
      assertEquals("Scene cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should handle device not found gracefully")
    void testExecuteSceneWithMissingDevice() {
      Scene sceneWithMissingDevice = new Scene("Missing Device Scene");
      sceneWithMissingDevice.addAction(new Action("Non-existent Device", "turnOn", null));

      // Should not throw exception but print error
      assertDoesNotThrow(() -> sceneManager.executeScene(sceneWithMissingDevice));
    }

    @Test
    @DisplayName("Should handle invalid command gracefully")
    void testExecuteSceneWithInvalidCommand() {
      Scene sceneWithInvalidCommand = new Scene("Invalid Command Scene");
      sceneWithInvalidCommand.addAction(new Action("Test Light", "invalidCommand", null));

      // Should not throw exception but print error
      assertDoesNotThrow(() -> sceneManager.executeScene(sceneWithInvalidCommand));
    }
  }

  @Nested
  @DisplayName("Exception Testing")
  class ExceptionTesting {

    @Test
    @DisplayName("Test SceneExecutionException constructors")
    void testSceneExecutionExceptionConstructors() {
      // Test message constructor
      SceneExecutionException messageException = new SceneExecutionException("Test message");
      assertEquals("Test message", messageException.getMessage());

      // Test message + cause constructor
      Throwable cause = new RuntimeException("Test cause");
      SceneExecutionException messageCauseException =
          new SceneExecutionException("Test with cause", cause);
      assertEquals("Test with cause", messageCauseException.getMessage());
      assertEquals(cause, messageCauseException.getCause());
    }
  }
}

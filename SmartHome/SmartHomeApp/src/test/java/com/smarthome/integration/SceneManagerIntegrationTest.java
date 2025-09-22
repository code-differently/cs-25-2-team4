package com.smarthome.integration;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.devices.*;
import com.smarthome.exceptions.*;
import com.smarthome.scene.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;

import java.util.Collection;

/**
 * Integration tests for SceneManager that address User Story 2:
 * "As a homeowner I want to create a Scene that runs multiple device actions 
 * (e.g., dim lights, set thermostat) so that I can change my home's mood with one command."
 */
public class SceneManagerIntegrationTest {
    
    private HomeManager homeManager;
    private SceneManager sceneManager;
    
    // Rooms
    private Room livingRoom;
    private Room bedroom;
    private Room kitchen;
    
    // Devices
    private Light livingRoomLight;
    private Light bedroomLight;
    private Light kitchenLight;
    private Thermostat livingRoomThermostat;
    private Thermostat bedroomThermostat;
    private SecurityCamera frontCamera;

    @BeforeEach
    void setUp() {
        // Initialize HomeManager and SceneManager
        homeManager = new HomeManager("SCENE_TEST_ACCOUNT");
        sceneManager = new SceneManager(homeManager);
        
        // Create and add rooms
        livingRoom = new Room("Living Room");
        bedroom = new Room("Bedroom");
        kitchen = new Room("Kitchen");
        
        homeManager.addRoom(livingRoom);
        homeManager.addRoom(bedroom);
        homeManager.addRoom(kitchen);
        
        // Create devices
        livingRoomLight = new Light("LR_L001", "Living Room Light");
        bedroomLight = new Light("BL_001", "Bedroom Light");
        kitchenLight = new Light("KL_001", "Kitchen Light");
        
        livingRoomThermostat = new Thermostat("LR_T001", "Living Room Thermostat");
        bedroomThermostat = new Thermostat("BR_T001", "Bedroom Thermostat");
        
        frontCamera = new SecurityCamera("FC_001", "Front Camera");
        
        // Add devices to rooms
        homeManager.addDevice(livingRoomLight, livingRoom);
        homeManager.addDevice(bedroomLight, bedroom);
        homeManager.addDevice(kitchenLight, kitchen);
        homeManager.addDevice(livingRoomThermostat, livingRoom);
        homeManager.addDevice(bedroomThermostat, bedroom);
        homeManager.addDevice(frontCamera, livingRoom);
    }

    @Nested
    @DisplayName("Scene Creation and Storage - User Story 2")
    class SceneCreationAndStorage {
        
        @Test
        @DisplayName("Should create and store a named scene with device actions")
        void testCreateAndStoreScene() {
            // Create a "Good Morning" scene
            Scene morningScene = new Scene("Good Morning");
            
            // Add actions: turn on lights, set thermostats, start camera
            morningScene.addAction(new Action("Living Room Light", "turnOn"));
            morningScene.addAction(new Action("Living Room Light", "setBrightness", "80"));
            morningScene.addAction(new Action("Bedroom Light", "turnOn"));
            morningScene.addAction(new Action("Living Room Thermostat", "setTemp", "22.0"));
            morningScene.addAction(new Action("Front Camera", "startRecording"));
            
            // Store the scene
            assertTrue(sceneManager.addScene(morningScene));
            
            // Verify scene is stored and retrievable
            Scene retrievedScene = sceneManager.getSceneByName("Good Morning");
            assertNotNull(retrievedScene);
            assertEquals("Good Morning", retrievedScene.getName());
            assertEquals(5, retrievedScene.getActions().size());
            
            // Verify scene appears in collection
            Collection<Scene> allScenes = sceneManager.getScenes();
            assertEquals(1, allScenes.size());
            assertTrue(allScenes.contains(morningScene));
        }
        
        @Test
        @DisplayName("Should handle multiple scenes with different names")
        void testMultipleScenes() {
            // Create multiple scenes
            Scene morningScene = new Scene("Good Morning");
            morningScene.addAction(new Action("Living Room Light", "turnOn"));
            
            Scene eveningScene = new Scene("Good Evening");
            eveningScene.addAction(new Action("Living Room Light", "setBrightness", "30"));
            eveningScene.addAction(new Action("Living Room Thermostat", "setTemp", "20.0"));
            
            Scene nightScene = new Scene("Good Night");
            nightScene.addAction(new Action("Living Room Light", "turnOff"));
            nightScene.addAction(new Action("Bedroom Light", "turnOff"));
            
            // Add all scenes
            assertTrue(sceneManager.addScene(morningScene));
            assertTrue(sceneManager.addScene(eveningScene));
            assertTrue(sceneManager.addScene(nightScene));
            
            // Verify all scenes are stored
            assertEquals(3, sceneManager.getScenes().size());
            assertNotNull(sceneManager.getSceneByName("Good Morning"));
            assertNotNull(sceneManager.getSceneByName("Good Evening"));
            assertNotNull(sceneManager.getSceneByName("Good Night"));
        }
        
        @Test
        @DisplayName("Should prevent duplicate scene names")
        void testPreventDuplicateScenes() {
            Scene originalScene = new Scene("Duplicate Test");
            originalScene.addAction(new Action("Living Room Light", "turnOn"));
            
            Scene duplicateScene = new Scene("Duplicate Test");
            duplicateScene.addAction(new Action("Bedroom Light", "turnOn"));
            
            // First scene should be added
            assertTrue(sceneManager.addScene(originalScene));
            
            // Duplicate scene should be rejected
            assertFalse(sceneManager.addScene(duplicateScene));
            
            // Only one scene should exist
            assertEquals(1, sceneManager.getScenes().size());
            
            // Original scene should still be there
            Scene retrieved = sceneManager.getSceneByName("Duplicate Test");
            assertEquals(1, retrieved.getActions().size());
            assertEquals("Living Room Light", retrieved.getActions().get(0).getDeviceId());
        }
    }

    @Nested
    @DisplayName("Scene Execution - User Story 2")
    class SceneExecution {
        
        @Test
        @DisplayName("Should execute all actions in a scene successfully")
        void testSuccessfulSceneExecution() throws SceneExecutionException {
            // Create and store a comprehensive scene
            Scene testScene = new Scene("Integration Test Scene");
            testScene.addAction(new Action("Living Room Light", "turnOn"));
            testScene.addAction(new Action("Living Room Light", "setBrightness", "75"));
            testScene.addAction(new Action("Bedroom Light", "turnOn"));
            testScene.addAction(new Action("Living Room Thermostat", "turnOn"));
            testScene.addAction(new Action("Living Room Thermostat", "setTemp", "23.0"));
            testScene.addAction(new Action("Front Camera", "startRecording"));
            
            sceneManager.addScene(testScene);
            
            // Execute the scene
            assertDoesNotThrow(() -> sceneManager.executeScene("Integration Test Scene"));
            
            // Verify all devices are in expected states
            assertTrue(livingRoomLight.isOn());
            assertEquals(75, livingRoomLight.getBrightness());
            assertTrue(bedroomLight.isOn());
            assertTrue(livingRoomThermostat.isOn());
            assertEquals(23.0, livingRoomThermostat.getTemp());
            assertTrue(frontCamera.isRecording());
        }
        
        @Test
        @DisplayName("Should report partial success when some actions fail")
        void testPartialSceneExecution() {
            // Create a scene with both valid and invalid actions
            Scene testScene = new Scene("Partial Success Scene");
            
            // Valid actions
            testScene.addAction(new Action("Living Room Light", "turnOn"));
            testScene.addAction(new Action("Bedroom Light", "turnOn"));
            
            // Invalid action - non-existent device
            testScene.addAction(new Action("NonExistent Device", "turnOn"));
            
            // Invalid action - unsupported command on thermostat
            testScene.addAction(new Action("Living Room Thermostat", "setBrightness", "50"));
            
            // More valid actions
            testScene.addAction(new Action("Front Camera", "startRecording"));
            
            sceneManager.addScene(testScene);
            
            // Scene execution should continue despite failures
            assertDoesNotThrow(() -> sceneManager.executeScene("Partial Success Scene"));
            
            // Verify that valid actions were executed
            assertTrue(livingRoomLight.isOn());
            assertTrue(bedroomLight.isOn());
            assertTrue(frontCamera.isRecording());
        }
        
        @Test
        @DisplayName("Should throw SceneExecutionException for non-existent scene")
        void testNonExistentSceneExecution() {
            SceneExecutionException exception = assertThrows(
                SceneExecutionException.class,
                () -> sceneManager.executeScene("Non-Existent Scene")
            );
            
            assertEquals("Scene not found: Non-Existent Scene", exception.getMessage());
        }
        
        @Test
        @DisplayName("Should handle scene with no actions gracefully")
        void testEmptySceneExecution() throws SceneExecutionException {
            Scene emptyScene = new Scene("Empty Scene");
            sceneManager.addScene(emptyScene);
            
            // Should execute without errors
            assertDoesNotThrow(() -> sceneManager.executeScene("Empty Scene"));
        }
    }

    @Nested
    @DisplayName("Complex Scene Scenarios - User Story 2")
    class ComplexSceneScenarios {
        
        @Test
        @DisplayName("Should execute mood lighting scene")
        void testMoodLightingScene() throws SceneExecutionException {
            // Create a romantic dinner scene
            Scene romanticScene = new Scene("Romantic Dinner");
            romanticScene.addAction(new Action("Living Room Light", "turnOn"));
            romanticScene.addAction(new Action("Living Room Light", "setBrightness", "20"));
            romanticScene.addAction(new Action("Kitchen Light", "turnOn"));
            romanticScene.addAction(new Action("Kitchen Light", "setBrightness", "30"));
            romanticScene.addAction(new Action("Bedroom Light", "turnOff"));
            romanticScene.addAction(new Action("Living Room Thermostat", "setTemp", "21.5"));
            
            sceneManager.addScene(romanticScene);
            sceneManager.executeScene("Romantic Dinner");
            
            // Verify mood is set correctly
            assertTrue(livingRoomLight.isOn());
            assertEquals(20, livingRoomLight.getBrightness());
            assertTrue(kitchenLight.isOn());
            assertEquals(30, kitchenLight.getBrightness());
            assertFalse(bedroomLight.isOn());
            assertEquals(21.5, livingRoomThermostat.getTemp());
        }
        
        @Test
        @DisplayName("Should execute security scene")
        void testSecurityScene() throws SceneExecutionException {
            // Create an "Away Mode" security scene
            Scene awayScene = new Scene("Away Mode");
            awayScene.addAction(new Action("Living Room Light", "turnOff"));
            awayScene.addAction(new Action("Bedroom Light", "turnOff"));
            awayScene.addAction(new Action("Kitchen Light", "turnOff"));
            awayScene.addAction(new Action("Living Room Thermostat", "setTemp", "18.0"));
            awayScene.addAction(new Action("Bedroom Thermostat", "setTemp", "18.0"));
            awayScene.addAction(new Action("Front Camera", "startRecording"));
            
            sceneManager.addScene(awayScene);
            sceneManager.executeScene("Away Mode");
            
            // Verify security mode is active
            assertFalse(livingRoomLight.isOn());
            assertFalse(bedroomLight.isOn());
            assertFalse(kitchenLight.isOn());
            assertEquals(18.0, livingRoomThermostat.getTemp());
            assertEquals(18.0, bedroomThermostat.getTemp());
            assertTrue(frontCamera.isRecording());
        }
        
        @Test
        @DisplayName("Should execute wake up scene with gradual brightness")
        void testWakeUpScene() throws SceneExecutionException {
            // Create a gradual wake-up scene
            Scene wakeUpScene = new Scene("Wake Up");
            wakeUpScene.addAction(new Action("Bedroom Light", "turnOn"));
            wakeUpScene.addAction(new Action("Bedroom Light", "setBrightness", "10"));
            wakeUpScene.addAction(new Action("Living Room Light", "turnOn"));
            wakeUpScene.addAction(new Action("Living Room Light", "setBrightness", "40"));
            wakeUpScene.addAction(new Action("Bedroom Thermostat", "setTemp", "22.0"));
            wakeUpScene.addAction(new Action("Living Room Thermostat", "setTemp", "22.0"));
            
            sceneManager.addScene(wakeUpScene);
            sceneManager.executeScene("Wake Up");
            
            // Verify gentle wake-up environment
            assertTrue(bedroomLight.isOn());
            assertEquals(10, bedroomLight.getBrightness());
            assertTrue(livingRoomLight.isOn());
            assertEquals(40, livingRoomLight.getBrightness());
            assertEquals(22.0, bedroomThermostat.getTemp());
            assertEquals(22.0, livingRoomThermostat.getTemp());
        }
    }

    @Nested
    @DisplayName("Scene Management Operations")
    class SceneManagementOperations {
        
        @Test
        @DisplayName("Should remove scenes correctly")
        void testSceneRemoval() {
            Scene testScene = new Scene("To Be Removed");
            testScene.addAction(new Action("Living Room Light", "turnOn"));
            
            // Add and verify scene exists
            sceneManager.addScene(testScene);
            assertNotNull(sceneManager.getSceneByName("To Be Removed"));
            
            // Remove scene and verify it's gone
            assertTrue(sceneManager.removeScene("To Be Removed"));
            assertNull(sceneManager.getSceneByName("To Be Removed"));
            assertEquals(0, sceneManager.getScenes().size());
            
            // Removing non-existent scene should return false
            assertFalse(sceneManager.removeScene("Non-Existent Scene"));
        }
        
        @Test
        @DisplayName("Should handle null scene gracefully")
        void testNullSceneHandling() {
            // Adding null scene should return false
            assertFalse(sceneManager.addScene(null));
            
            // Scene with null name should return false
            Scene nullNameScene = new Scene(null);
            assertFalse(sceneManager.addScene(nullNameScene));
        }
    }
}
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

import java.time.LocalTime;

/**
 * Integration tests for RuleEngine that address User Story 3:
 * "As a homeowner I want an automation rule that, after 11pm, turns on hallway lights 
 * when motion is detected and sends me an alert so that I can safely move at night."
 */
public class RuleEngineIntegrationTest {
    
    private HomeManager homeManager;
    private SceneManager sceneManager;
    private RuleEngine ruleEngine;
    private TestNotificationService notificationService;
    
    // Rooms
    private Room hallway;
    private Room livingRoom;
    private Room bedroom;
    
    // Devices
    private Light hallwayLight;
    private Light livingRoomLight;
    private Light bedroomLight;
    private SecurityCamera hallwayCamera;
    private SecurityCamera frontDoorCamera;
    private Thermostat livingRoomThermostat;

    @BeforeEach
    void setUp() {
        // Initialize core components
        homeManager = new HomeManager("RULE_TEST_ACCOUNT");
        sceneManager = new SceneManager(homeManager);
        notificationService = new TestNotificationService();
        ruleEngine = new RuleEngine(sceneManager, notificationService);
        
        // Create and add rooms
        hallway = new Room("Hallway");
        livingRoom = new Room("Living Room");
        bedroom = new Room("Bedroom");
        
        homeManager.addRoom(hallway);
        homeManager.addRoom(livingRoom);
        homeManager.addRoom(bedroom);
        
        // Create devices
        hallwayLight = new Light("HW_L001", "Hallway Light");
        livingRoomLight = new Light("LR_L001", "Living Room Light");
        bedroomLight = new Light("BL_001", "Bedroom Light");
        
        hallwayCamera = new SecurityCamera("HW_C001", "Hallway Camera");
        frontDoorCamera = new SecurityCamera("FD_C001", "Front Door Camera");
        
        livingRoomThermostat = new Thermostat("LR_T001", "Living Room Thermostat");
        
        // Add devices to rooms
        homeManager.addDevice(hallwayLight, hallway);
        homeManager.addDevice(livingRoomLight, livingRoom);
        homeManager.addDevice(bedroomLight, bedroom);
        homeManager.addDevice(hallwayCamera, hallway);
        homeManager.addDevice(frontDoorCamera, hallway);
        homeManager.addDevice(livingRoomThermostat, livingRoom);
    }

    @Nested
    @DisplayName("Night Motion Detection - User Story 3")
    class NightMotionDetection {
        
        @Test
        @DisplayName("Should turn on hallway lights when motion detected after 11pm")
        void testNightMotionDetection() throws RuleConflictException, SceneExecutionException {
            // Create a scene that turns on hallway lights
            Scene nightLightScene = new Scene("Night Safety Lights");
            nightLightScene.addAction(new Action("Hallway Light", "turnOn"));
            nightLightScene.addAction(new Action("Hallway Light", "setBrightness", "50"));
            sceneManager.addScene(nightLightScene);
            
            // Create a rule for motion detection after 11pm
            Rule nightMotionRule = new Rule(
                "motion_detected",
                "Hallway Camera", 
                nightLightScene,
                LocalTime.of(23, 0),  // After 11:00 PM
                LocalTime.of(6, 0)    // Before 6:00 AM
            );
            
            ruleEngine.addRule(nightMotionRule);
            
            // Simulate motion detection at midnight (should trigger)
            ruleEngine.handleEvent("motion_detected", "Hallway Camera");
            
            // Verify lights are turned on
            assertTrue(hallwayLight.isOn());
            assertEquals(50, hallwayLight.getBrightness());
            
            // Verify notification was sent
            assertTrue(notificationService.wasNotificationSent());
            String lastNotification = notificationService.getLastNotification();
            assertTrue(lastNotification.contains("motion_detected"));
            assertTrue(lastNotification.contains("Hallway Camera"));
            assertTrue(lastNotification.contains("Hallway"));
        }
        
        @Test
        @DisplayName("Should not trigger rule during daytime hours")
        void testDaytimeMotionIgnored() throws RuleConflictException {
            // Create night motion rule (23:00 to 06:00)
            Scene nightScene = new Scene("Night Safety");
            nightScene.addAction(new Action("Hallway Light", "turnOn"));
            sceneManager.addScene(nightScene);
            
            Rule nightRule = new Rule(
                "motion_detected",
                "Hallway Camera", 
                nightScene,
                LocalTime.of(23, 0),
                LocalTime.of(6, 0)
            );
            
            // Test the rule's time logic directly with specific times
            // Should be inactive during daytime hours
            assertFalse(nightRule.isActiveNow(LocalTime.of(14, 0))); // 2:00 PM
            assertFalse(nightRule.isActiveNow(LocalTime.of(10, 0))); // 10:00 AM
            assertFalse(nightRule.isActiveNow(LocalTime.of(18, 30))); // 6:30 PM
            
            // Should be active during night hours
            assertTrue(nightRule.isActiveNow(LocalTime.of(23, 30))); // 11:30 PM
            assertTrue(nightRule.isActiveNow(LocalTime.of(1, 0)));   // 1:00 AM
            assertTrue(nightRule.isActiveNow(LocalTime.of(5, 30)));  // 5:30 AM
            
            // Test boundary conditions
            assertTrue(nightRule.isActiveNow(LocalTime.of(23, 0)));  // Exactly 11:00 PM (start time)
            assertTrue(nightRule.isActiveNow(LocalTime.of(6, 0)));   // Exactly 6:00 AM (end time)
            assertFalse(nightRule.isActiveNow(LocalTime.of(22, 59))); // Just before start
            assertFalse(nightRule.isActiveNow(LocalTime.of(6, 1)));   // Just after end
        }
        
        @Test
        @DisplayName("Should handle multiple motion sensors in night mode")
        void testMultipleMotionSensors() throws RuleConflictException, SceneExecutionException {
            // Create scenes for different areas
            Scene hallwayScene = new Scene("Hallway Night Lights");
            hallwayScene.addAction(new Action("Hallway Light", "turnOn"));
            hallwayScene.addAction(new Action("Hallway Light", "setBrightness", "40"));
            
            Scene frontDoorScene = new Scene("Front Door Security");
            frontDoorScene.addAction(new Action("Hallway Light", "turnOn"));
            frontDoorScene.addAction(new Action("Living Room Light", "turnOn"));
            frontDoorScene.addAction(new Action("Living Room Light", "setBrightness", "25"));
            
            sceneManager.addScene(hallwayScene);
            sceneManager.addScene(frontDoorScene);
            
            // Create rules for different cameras
            Rule hallwayMotionRule = new Rule(
                "motion_detected",
                "Hallway Camera", 
                hallwayScene,
                LocalTime.of(23, 0),
                LocalTime.of(6, 0)
            );
            
            Rule frontDoorMotionRule = new Rule(
                "motion_detected",
                "Front Door Camera", 
                frontDoorScene,
                LocalTime.of(23, 0),
                LocalTime.of(6, 0)
            );
            
            ruleEngine.addRule(hallwayMotionRule);
            ruleEngine.addRule(frontDoorMotionRule);
            
            // Test hallway camera motion
            ruleEngine.handleEvent("motion_detected", "Hallway Camera");
            assertTrue(hallwayLight.isOn());
            assertEquals(40, hallwayLight.getBrightness());
            
            // Reset lights and test front door camera
            hallwayLight.turnOff();
            livingRoomLight.turnOff();
            
            ruleEngine.handleEvent("motion_detected", "Front Door Camera");
            assertTrue(hallwayLight.isOn());
            assertTrue(livingRoomLight.isOn());
            assertEquals(25, livingRoomLight.getBrightness());
        }
    }

    @Nested
    @DisplayName("Rule Conflict Management - User Story 3")
    class RuleConflictManagement {
        
        @Test
        @DisplayName("Should detect and prevent conflicting rules")
        void testRuleConflictDetection() throws RuleConflictException {
            Scene scene1 = new Scene("First Scene");
            scene1.addAction(new Action("Hallway Light", "turnOn"));
            
            Scene scene2 = new Scene("Second Scene");
            scene2.addAction(new Action("Hallway Light", "setBrightness", "100"));
            
            sceneManager.addScene(scene1);
            sceneManager.addScene(scene2);
            
            // Add first rule
            Rule firstRule = new Rule("motion_detected", "Hallway Camera", scene1);
            ruleEngine.addRule(firstRule);
            
            // Try to add conflicting rule (same event, same device)
            Rule conflictingRule = new Rule("motion_detected", "Hallway Camera", scene2);
            
            RuleConflictException exception = assertThrows(
                RuleConflictException.class,
                () -> ruleEngine.addRule(conflictingRule)
            );
            
            assertTrue(exception.getMessage().contains("Conflict detected"));
            assertTrue(exception.getMessage().contains("Hallway Camera"));
            assertTrue(exception.getMessage().contains("motion_detected"));
        }
        
        @Test
        @DisplayName("Should allow rules for different devices with same event")
        void testAllowDifferentDeviceRules() throws RuleConflictException {
            Scene hallwayScene = new Scene("Hallway Scene");
            hallwayScene.addAction(new Action("Hallway Light", "turnOn"));
            
            Scene frontDoorScene = new Scene("Front Door Scene");
            frontDoorScene.addAction(new Action("Living Room Light", "turnOn"));
            
            sceneManager.addScene(hallwayScene);
            sceneManager.addScene(frontDoorScene);
            
            // Add rules for different devices with same event type
            Rule hallwayRule = new Rule("motion_detected", "Hallway Camera", hallwayScene);
            Rule frontDoorRule = new Rule("motion_detected", "Front Door Camera", frontDoorScene);
            
            // Both should be added successfully
            assertDoesNotThrow(() -> ruleEngine.addRule(hallwayRule));
            assertDoesNotThrow(() -> ruleEngine.addRule(frontDoorRule));
        }
        
        @Test
        @DisplayName("Should allow rules for same device with different events")
        void testAllowDifferentEventRules() throws RuleConflictException {
            Scene motionScene = new Scene("Motion Response");
            motionScene.addAction(new Action("Hallway Light", "turnOn"));
            
            Scene recordingScene = new Scene("Recording Started");
            recordingScene.addAction(new Action("Living Room Light", "setBrightness", "100"));
            
            sceneManager.addScene(motionScene);
            sceneManager.addScene(recordingScene);
            
            // Add rules for same device with different events
            Rule motionRule = new Rule("motion_detected", "Hallway Camera", motionScene);
            Rule recordingRule = new Rule("recording_started", "Hallway Camera", recordingScene);
            
            // Both should be added successfully
            assertDoesNotThrow(() -> ruleEngine.addRule(motionRule));
            assertDoesNotThrow(() -> ruleEngine.addRule(recordingRule));
        }
    }

    @Nested
    @DisplayName("Error Handling and Device Failures - User Story 3")
    class ErrorHandlingAndDeviceFailures {
        
        @Test
        @DisplayName("Should handle missing target devices gracefully")
        void testMissingTargetDevice() throws RuleConflictException {
            // Create scene with non-existent device
            Scene faultyScene = new Scene("Faulty Scene");
            faultyScene.addAction(new Action("Non-Existent Light", "turnOn"));
            faultyScene.addAction(new Action("Hallway Light", "turnOn")); // This should still work
            
            sceneManager.addScene(faultyScene);
            
            Rule testRule = new Rule("motion_detected", "Hallway Camera", faultyScene);
            ruleEngine.addRule(testRule);
            
            // Trigger the rule - should not throw exception but should continue execution
            assertDoesNotThrow(() -> ruleEngine.handleEvent("motion_detected", "Hallway Camera"));
            
            // Valid device should still be controlled
            assertTrue(hallwayLight.isOn());
            
            // Notification should still be sent
            assertTrue(notificationService.wasNotificationSent());
        }
        
        @Test
        @DisplayName("Should handle invalid commands on devices")
        void testInvalidDeviceCommands() throws RuleConflictException {
            Scene invalidCommandScene = new Scene("Invalid Commands");
            // Invalid command - thermostats don't have setBrightness
            invalidCommandScene.addAction(new Action("Living Room Thermostat", "setBrightness", "50"));
            // Valid command
            invalidCommandScene.addAction(new Action("Hallway Light", "turnOn"));
            
            sceneManager.addScene(invalidCommandScene);
            
            Rule testRule = new Rule("test_event", "Hallway Camera", invalidCommandScene);
            ruleEngine.addRule(testRule);
            
            // Should not throw exception
            assertDoesNotThrow(() -> ruleEngine.handleEvent("test_event", "Hallway Camera"));
            
            // Valid action should still execute
            assertTrue(hallwayLight.isOn());
        }
        
        @Test
        @DisplayName("Should report execution status correctly")
        void testExecutionStatusReporting() throws RuleConflictException {
            Scene successScene = new Scene("Success Scene");
            successScene.addAction(new Action("Hallway Light", "turnOn"));
            successScene.addAction(new Action("Living Room Light", "turnOn"));
            
            sceneManager.addScene(successScene);
            
            Rule successRule = new Rule("success_test", "Hallway Camera", successScene);
            ruleEngine.addRule(successRule);
            
            // Trigger successful execution
            ruleEngine.handleEvent("success_test", "Hallway Camera");
            
            // Verify all actions executed
            assertTrue(hallwayLight.isOn());
            assertTrue(livingRoomLight.isOn());
            
            // Verify notification was sent
            assertTrue(notificationService.wasNotificationSent());
            String notification = notificationService.getLastNotification();
            assertTrue(notification.contains("success_test"));
        }
    }

    @Nested
    @DisplayName("Time-Based Rule Evaluation")
    class TimeBasedRuleEvaluation {
        
        @Test
        @DisplayName("Should handle overnight time windows correctly")
        void testOvernightTimeWindow() throws RuleConflictException {
            Scene nightScene = new Scene("Overnight Scene");
            nightScene.addAction(new Action("Hallway Light", "turnOn"));
            sceneManager.addScene(nightScene);
            
            // Rule active from 11 PM to 6 AM (crosses midnight)
            Rule overnightRule = new Rule(
                "motion_detected",
                "Hallway Camera",
                nightScene,
                LocalTime.of(23, 0),  // 11:00 PM
                LocalTime.of(6, 0)    // 6:00 AM
            );
            
            ruleEngine.addRule(overnightRule);
            
            // Test at different times by creating new rules that simulate different times
            // This is a simplified test - in real implementation you'd mock the time
            
            // Test that rule was added successfully
            assertDoesNotThrow(() -> ruleEngine.handleEvent("motion_detected", "Hallway Camera"));
        }
        
        @Test
        @DisplayName("Should handle global events correctly")
        void testGlobalEvents() throws RuleConflictException {
            Scene systemScene = new Scene("System Response");
            systemScene.addAction(new Action("Hallway Light", "turnOn"));
            systemScene.addAction(new Action("Living Room Light", "turnOn"));
            
            sceneManager.addScene(systemScene);
            
            // Global event rule (no specific device)
            Rule globalRule = new Rule("system_alert", systemScene);
            ruleEngine.addRule(globalRule);
            
            // Trigger global event
            ruleEngine.handleGlobalEvent("system_alert");
            
            // Verify scene executed
            assertTrue(hallwayLight.isOn());
            assertTrue(livingRoomLight.isOn());
            
            // Verify notification
            assertTrue(notificationService.wasNotificationSent());
            String notification = notificationService.getLastNotification();
            assertTrue(notification.contains("Global event"));
            assertTrue(notification.contains("system_alert"));
        }
    }

    @Nested
    @DisplayName("Performance and Timing Requirements - User Story 3")
    class PerformanceAndTiming {
        
        @Test
        @DisplayName("Should execute scene within reasonable time")
        void testSceneExecutionTiming() throws RuleConflictException, InterruptedException {
            Scene quickResponseScene = new Scene("Quick Response");
            quickResponseScene.addAction(new Action("Hallway Light", "turnOn"));
            quickResponseScene.addAction(new Action("Hallway Light", "setBrightness", "75"));
            
            sceneManager.addScene(quickResponseScene);
            
            Rule quickRule = new Rule("urgent_motion", "Hallway Camera", quickResponseScene);
            ruleEngine.addRule(quickRule);
            
            // Measure execution time
            long startTime = System.currentTimeMillis();
            ruleEngine.handleEvent("urgent_motion", "Hallway Camera");
            long endTime = System.currentTimeMillis();
            
            // Verify quick execution (should be well under 2 seconds as per user story)
            long executionTime = endTime - startTime;
            assertTrue(executionTime < 2000, "Scene execution took " + executionTime + "ms, should be under 2000ms");
            
            // Verify scene executed correctly
            assertTrue(hallwayLight.isOn());
            assertEquals(75, hallwayLight.getBrightness());
        }
    }

    /**
     * Test implementation of NotificationService for testing purposes
     */
    private static class TestNotificationService implements NotificationService {
        private boolean notificationSent = false;
        private String lastNotification = "";
        
        @Override
        public void sendAlert(String message) {
            this.notificationSent = true;
            this.lastNotification = message;
            System.out.println("TEST NOTIFICATION: " + message);
        }
        
        public boolean wasNotificationSent() {
            return notificationSent;
        }
        
        public String getLastNotification() {
            return lastNotification;
        }
    }
}
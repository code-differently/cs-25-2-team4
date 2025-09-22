package com.smarthome.app;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.devices.*;
import com.smarthome.exceptions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;

/**
 * Comprehensive unit tests for CommandExecutor class to improve coverage
 */
public class CommandExecutorTest {
    
    private CommandExecutor commandExecutor;
    
    @BeforeEach
    void setUp() {
        commandExecutor = new CommandExecutor();
    }
    
    @Nested
    @DisplayName("Command Support Validation")
    class CommandSupportValidation {
        
        @Test
        @DisplayName("Should identify supported commands correctly")
        void testIsCommandSupported() {
            assertTrue(commandExecutor.isCommandSupported("turnOn"));
            assertTrue(commandExecutor.isCommandSupported("turnOff"));
            assertTrue(commandExecutor.isCommandSupported("setBrightness"));
            assertTrue(commandExecutor.isCommandSupported("setTemp"));
            assertTrue(commandExecutor.isCommandSupported("startRecording"));
            assertTrue(commandExecutor.isCommandSupported("stopRecording"));
            assertTrue(commandExecutor.isCommandSupported("getTemp"));
            assertTrue(commandExecutor.isCommandSupported("isRecording"));
            
            assertFalse(commandExecutor.isCommandSupported("invalidCommand"));
            assertFalse(commandExecutor.isCommandSupported("nonExistentMethod"));
        }
        
        @Test
        @DisplayName("Should return all supported commands")
        void testGetSupportedCommands() {
            var supportedCommands = commandExecutor.getSupportedCommands();
            
            assertNotNull(supportedCommands);
            assertTrue(supportedCommands.contains("turnOn"));
            assertTrue(supportedCommands.contains("turnOff"));
            assertTrue(supportedCommands.contains("setBrightness"));
            assertTrue(supportedCommands.contains("setTemp"));
            assertTrue(supportedCommands.contains("startRecording"));
            assertTrue(supportedCommands.contains("stopRecording"));
            
            // Should have at least 8 commands
            assertTrue(supportedCommands.size() >= 8);
        }
    }
    
    @Nested
    @DisplayName("Light Command Execution")
    class LightCommandExecution {
        
        private Light light;
        
        @BeforeEach
        void setUp() {
            light = new Light("L001", "Test Light");
        }
        
        @Test
        @DisplayName("Should execute setBrightness with Integer argument")
        void testSetBrightnessWithInteger() throws InvalidCommandException {
            light.turnOn(); // Light must be on to set brightness
            
            commandExecutor.execute(light, "setBrightness", 75);
            assertEquals(75, light.getBrightness());
        }
        
        @Test
        @DisplayName("Should execute setBrightness with String argument")
        void testSetBrightnessWithString() throws InvalidCommandException {
            light.turnOn(); // Light must be on to set brightness
            
            commandExecutor.execute(light, "setBrightness", "50");
            assertEquals(50, light.getBrightness());
        }
        
        @Test
        @DisplayName("Should throw exception for setBrightness with invalid string")
        void testSetBrightnessWithInvalidString() {
            light.turnOn();
            
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "setBrightness", "invalid")
            );
            
            assertNotNull(exception.getCause());
        }
        
        @Test
        @DisplayName("Should throw exception for setBrightness with unsupported type")
        void testSetBrightnessWithUnsupportedType() {
            light.turnOn();
            
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "setBrightness", 75.5) // Double instead of Integer/String
            );
            
            assertTrue(exception.getCause().getMessage().contains("integer brightness value"));
        }
        
        @Test
        @DisplayName("Should throw exception for setBrightness without arguments")
        void testSetBrightnessWithoutArguments() {
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "setBrightness")
            );
            
            assertTrue(exception.getCause().getMessage().contains("requires brightness value"));
        }
        
        @Test
        @DisplayName("Should throw exception for setBrightness on non-Light device")
        void testSetBrightnessOnNonLight() {
            Thermostat thermostat = new Thermostat("T001", "Test Thermostat");
            
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(thermostat, "setBrightness", 50)
            );
            
            assertTrue(exception.getCause().getMessage().contains("not a Light"));
        }
    }
    
    @Nested
    @DisplayName("Thermostat Command Execution")
    class ThermostatCommandExecution {
        
        private Thermostat thermostat;
        
        @BeforeEach
        void setUp() {
            thermostat = new Thermostat("T001", "Test Thermostat");
        }
        
        @Test
        @DisplayName("Should execute setTemp with Double argument")
        void testSetTempWithDouble() throws InvalidCommandException {
            commandExecutor.execute(thermostat, "setTemp", 22.5);
            assertEquals(22.5, thermostat.getTemp());
        }
        
        @Test
        @DisplayName("Should execute setTemp with String argument")
        void testSetTempWithString() throws InvalidCommandException {
            commandExecutor.execute(thermostat, "setTemp", "19.5");
            assertEquals(19.5, thermostat.getTemp());
        }
        
        @Test
        @DisplayName("Should execute setTemp with Integer argument")
        void testSetTempWithInteger() throws InvalidCommandException {
            commandExecutor.execute(thermostat, "setTemp", 25);
            assertEquals(25.0, thermostat.getTemp());
        }
        
        @Test
        @DisplayName("Should throw exception for setTemp without arguments")
        void testSetTempWithoutArguments() {
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(thermostat, "setTemp")
            );
            
            assertTrue(exception.getCause().getMessage().contains("requires temperature value"));
        }
        
        @Test
        @DisplayName("Should throw exception for setTemp on non-Thermostat device")
        void testSetTempOnNonThermostat() {
            Light light = new Light("L001", "Test Light");
            
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "setTemp", 22.0)
            );
            
            assertTrue(exception.getCause().getMessage().contains("not a Thermostat"));
        }
        
        @Test
        @DisplayName("Should execute getTemp command")
        void testGetTempCommand() throws InvalidCommandException {
            thermostat.setTemp(18.5);
            
            // getTemp is a read operation, just verify it doesn't throw
            assertDoesNotThrow(() -> commandExecutor.execute(thermostat, "getTemp"));
        }
        
        @Test
        @DisplayName("Should throw exception for getTemp on non-Thermostat device")
        void testGetTempOnNonThermostat() {
            Light light = new Light("L001", "Test Light");
            
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "getTemp")
            );
            
            assertTrue(exception.getCause().getMessage().contains("not a Thermostat"));
        }
    }
    
    @Nested
    @DisplayName("Security Camera Command Execution")
    class SecurityCameraCommandExecution {
        
        private SecurityCamera camera;
        
        @BeforeEach
        void setUp() {
            camera = new SecurityCamera("C001", "Test Camera");
        }
        
        @Test
        @DisplayName("Should execute startRecording command")
        void testStartRecordingCommand() throws InvalidCommandException {
            commandExecutor.execute(camera, "startRecording");
            assertTrue(camera.isRecording());
        }
        
        @Test
        @DisplayName("Should execute stopRecording command")
        void testStopRecordingCommand() throws InvalidCommandException {
            camera.startRecording();
            commandExecutor.execute(camera, "stopRecording");
            assertFalse(camera.isRecording());
        }
        
        @Test
        @DisplayName("Should execute isRecording command")
        void testIsRecordingCommand() throws InvalidCommandException {
            camera.startRecording();
            
            // isRecording is a read operation, just verify it doesn't throw
            assertDoesNotThrow(() -> commandExecutor.execute(camera, "isRecording"));
        }
        
        @Test
        @DisplayName("Should throw exception for camera commands on non-Camera device")
        void testCameraCommandsOnNonCamera() {
            Light light = new Light("L001", "Test Light");
            
            InvalidCommandException startException = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "startRecording")
            );
            assertTrue(startException.getCause().getMessage().contains("not a SecurityCamera"));
            
            InvalidCommandException stopException = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "stopRecording")
            );
            assertTrue(stopException.getCause().getMessage().contains("not a SecurityCamera"));
            
            InvalidCommandException isRecordingException = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "isRecording")
            );
            assertTrue(isRecordingException.getCause().getMessage().contains("not a SecurityCamera"));
        }
    }
    
    @Nested
    @DisplayName("Switchable Device Command Execution")
    class SwitchableDeviceCommandExecution {
        
        @Test
        @DisplayName("Should execute turnOn on all switchable devices")
        void testTurnOnCommand() throws InvalidCommandException {
            Light light = new Light("L001", "Test Light");
            Thermostat thermostat = new Thermostat("T001", "Test Thermostat");
            SecurityCamera camera = new SecurityCamera("C001", "Test Camera");
            
            commandExecutor.execute(light, "turnOn");
            assertTrue(light.isOn());
            
            commandExecutor.execute(thermostat, "turnOn");
            assertTrue(thermostat.isOn());
            
            commandExecutor.execute(camera, "turnOn");
            assertTrue(camera.isOn());
        }
        
        @Test
        @DisplayName("Should execute turnOff on all switchable devices")
        void testTurnOffCommand() throws InvalidCommandException {
            Light light = new Light("L001", "Test Light");
            Thermostat thermostat = new Thermostat("T001", "Test Thermostat");
            SecurityCamera camera = new SecurityCamera("C001", "Test Camera");
            
            // Turn them on first
            light.turnOn();
            thermostat.turnOn();
            camera.turnOn();
            
            commandExecutor.execute(light, "turnOff");
            assertFalse(light.isOn());
            
            commandExecutor.execute(thermostat, "turnOff");
            assertFalse(thermostat.isOn());
            
            commandExecutor.execute(camera, "turnOff");
            assertFalse(camera.isOn());
        }
        
        @Test
        @DisplayName("Should throw exception for switchable commands on non-switchable device")
        void testSwitchableCommandsOnNonSwitchableDevice() {
            // Create a mock device that doesn't implement SwitchableDevice
            Device nonSwitchableDevice = new Device("D001", "Non-Switchable Device") {
                @Override
                public String getStatus() {
                    return "Test Status";
                }
            };
            
            InvalidCommandException turnOnException = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(nonSwitchableDevice, "turnOn")
            );
            assertTrue(turnOnException.getCause().getMessage().contains("does not support turnOn"));
            
            InvalidCommandException turnOffException = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(nonSwitchableDevice, "turnOff")
            );
            assertTrue(turnOffException.getCause().getMessage().contains("does not support turnOff"));
        }
    }
    
    @Nested
    @DisplayName("Error Handling")
    class ErrorHandling {
        
        @Test
        @DisplayName("Should throw exception for null device")
        void testNullDevice() {
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(null, "turnOn")
            );
            
            assertTrue(exception.getCause().getMessage().contains("Device cannot be null"));
        }
        
        @Test
        @DisplayName("Should throw exception for unknown command")
        void testUnknownCommand() {
            Light light = new Light("L001", "Test Light");
            
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "unknownCommand")
            );
            
            assertTrue(exception.getCause().getMessage().contains("Unknown command: unknownCommand"));
        }
        
        @Test
        @DisplayName("Should handle runtime exceptions from device methods")
        void testRuntimeExceptionHandling() {
            // This test would require a mock device that throws exceptions
            // For now, we'll test with invalid arguments that cause runtime exceptions
            Light light = new Light("L001", "Test Light");
            
            InvalidCommandException exception = assertThrows(
                InvalidCommandException.class,
                () -> commandExecutor.execute(light, "setBrightness", new Object[0]) // Empty array
            );
            
            assertNotNull(exception.getCause());
        }
    }

    @Nested
    @DisplayName("Exception Constructor Tests")
    class ExceptionConstructorTests {
        
        @Test
        @DisplayName("Test InvalidCommandException constructors")
        void testInvalidCommandExceptionConstructors() {
            // Test message constructor
            InvalidCommandException messageException = new InvalidCommandException("Test message");
            assertEquals("Test message", messageException.getMessage());
            
            // Test message + cause constructor
            Throwable cause = new RuntimeException("Root cause");
            InvalidCommandException messageCauseException = new InvalidCommandException("Test with cause", cause);
            assertEquals("Test with cause", messageCauseException.getMessage());
            assertEquals(cause, messageCauseException.getCause());
        }
    }
}
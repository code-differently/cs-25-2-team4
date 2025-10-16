package com.smarthome.backend.entity;

import com.smarthome.backend.enums.DeviceStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Light Entity Tests")
class LightTest {
    
    private Validator validator;
    private Light light;
    private Room room;
    
    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        Home home = new Home("Test Home", "123 Test St");
        room = new Room(home, "Test Room");
        light = new Light();
    }
    
    @Test
    @DisplayName("Default constructor creates light with default values")
    void defaultConstructor_ShouldCreateLightWithDefaults() {
        Light newLight = new Light();
        
        assertEquals(0, newLight.getBrightness());
        assertEquals("#FFFFFF", newLight.getColorHex());
        assertEquals(DeviceStatus.OFF, newLight.getStatus());
    }
    
    @Test
    @DisplayName("Parameterized constructor sets fields correctly")
    void parameterizedConstructor_ShouldSetFields() {
        String deviceName = "Living Room Light";
        
        Light newLight = new Light(deviceName, room);
        
        assertEquals(deviceName, newLight.getDeviceName());
        assertEquals(room, newLight.getRoom());
        assertEquals(0, newLight.getBrightness());
        assertEquals("#FFFFFF", newLight.getColorHex());
        assertEquals(DeviceStatus.OFF, newLight.getStatus());
    }
    
    @Test
    @DisplayName("Valid light passes validation")
    void validLight_ShouldPassValidation() {
        light.setDeviceName("Valid Light");
        light.setBrightness(50);
        light.setColorHex("#FF0000");
        
        Set<ConstraintViolation<Light>> violations = validator.validate(light);
        
        assertTrue(violations.isEmpty());
    }
    
    @Test
    @DisplayName("Color hex validation tests")
    void colorHexValidation_ShouldEnforceConstraints() {
        light.setDeviceName("Test Light");
        light.setBrightness(50);
        
        // Test invalid color format
        light.setColorHex("invalid");
        Set<ConstraintViolation<Light>> violations = validator.validate(light);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("Color must be a valid hex color")));
        
        // Test valid color formats
        String[] validColors = {"#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#123ABC"};
        for (String color : validColors) {
            light.setColorHex(color);
            violations = validator.validate(light);
            assertTrue(violations.isEmpty(), "Color " + color + " should be valid");
        }
    }
    
    @Test
    @DisplayName("Set brightness should auto-turn on/off")
    void setBrightness_ShouldAutoTurnOnOff() {
        // Setting brightness > 0 should turn on
        light.setBrightness(50);
        assertTrue(light.isOn());
        assertEquals(DeviceStatus.ON, light.getStatus());
        
        // Setting brightness to 0 should turn off
        light.setBrightness(0);
        assertFalse(light.isOn());
        assertEquals(DeviceStatus.OFF, light.getStatus());
    }
    
    @Test
    @DisplayName("Set brightness should clamp values to valid range")
    void setBrightness_ShouldClampValues() {
        // Test clamping below minimum
        light.setBrightness(-10);
        assertEquals(0, light.getBrightness());
        
        // Test clamping above maximum
        light.setBrightness(150);
        assertEquals(100, light.getBrightness());
        
        // Test valid value
        light.setBrightness(75);
        assertEquals(75, light.getBrightness());
    }
    
    @Test
    @DisplayName("Toggle method should switch on/off state")
    void toggle_ShouldSwitchState() {
        // Initially off
        assertFalse(light.isOn());
        
        // Toggle on
        light.toggle();
        assertTrue(light.isOn());
        
        // Toggle off
        light.toggle();
        assertFalse(light.isOn());
    }
    
    @Test
    @DisplayName("SetBrightnessAndColor method should set both and turn on")
    void setBrightnessAndColor_ShouldSetBothAndTurnOn() {
        light.setBrightnessAndColor(75, "#FF0000");
        
        assertEquals(75, light.getBrightness());
        assertEquals("#FF0000", light.getColorHex());
        assertTrue(light.isOn());
    }
    
    @Test
    @DisplayName("SetBrightnessAndColor with 0 brightness should not turn on")
    void setBrightnessAndColor_WithZeroBrightness_ShouldNotTurnOn() {
        light.setBrightnessAndColor(0, "#FF0000");
        
        assertEquals(0, light.getBrightness());
        assertEquals("#FF0000", light.getColorHex());
        assertFalse(light.isOn());
    }
    
    @Test
    @DisplayName("PerformAction method should handle different actions")
    void performAction_ShouldHandleDifferentActions() {
        // Test toggle action
        light.performAction("toggle", null);
        assertTrue(light.isOn());
        
        // Test brightness action
        light.performAction("brightness", 80);
        assertEquals(80, light.getBrightness());
        
        // Test color action
        light.performAction("color", "#00FF00");
        assertEquals("#00FF00", light.getColorHex());
        
        // Test unknown action
        assertThrows(IllegalArgumentException.class, () -> 
            light.performAction("unknown", null));
    }
    
    @Test
    @DisplayName("GetDeviceInfo should return formatted string")
    void getDeviceInfo_ShouldReturnFormattedString() {
        light.setDeviceName("Test Light");
        light.setBrightness(75);
        light.setColorHex("#FF0000");
        light.turnOn();
        
        String info = light.getDeviceInfo();
        
        assertTrue(info.contains("Light: Test Light"));
        assertTrue(info.contains("Brightness: 75%"));
        assertTrue(info.contains("Color: #FF0000"));
        assertTrue(info.contains("Status: ON"));
    }
    
    @Test
    @DisplayName("Inherited device methods should work")
    void inheritedDeviceMethods_ShouldWork() {
        light.setDeviceName("Test Light");
        
        // Test turn on/off
        light.turnOn();
        assertTrue(light.isOn());
        assertEquals(DeviceStatus.ON, light.getStatus());
        
        light.turnOff();
        assertFalse(light.isOn());
        assertEquals(DeviceStatus.OFF, light.getStatus());
        
        // Test device name
        assertEquals("Test Light", light.getDeviceName());
    }
    
    @Test
    @DisplayName("Getters and setters work correctly")
    void gettersAndSetters_ShouldWorkCorrectly() {
        String color = "#123456";
        
        light.setColorHex(color);
        assertEquals(color, light.getColorHex());
        
        // Brightness is tested above with auto on/off behavior
    }
}
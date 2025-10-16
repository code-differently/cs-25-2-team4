package com.smarthome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "light_properties")
@DiscriminatorValue("LIGHT")
@PrimaryKeyJoinColumn(name = "device_id")
public class Light extends Device {

        @Column(name = "brightness")
        @Min(value = 0)
        @Max(value = 100)
        private int brightness = 0; // 0-100

        @Column(name = "color_hex", length = 7)
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$")
        private String colorHex = "#FFFFFF"; // Default white

        // Constructors
        public Light() {}

        public Light(String deviceName, Room room) {
                super(deviceName, room);
        }

        // Abstract method implementations
        @Override
        public String getDeviceInfo() {
                return String.format(
                                "Light: %s | Brightness: %d%% | Color: %s | Status: %s",
                                getDeviceName(), brightness, colorHex, isOn() ? "ON" : "OFF");
        }

        @Override
        public void performAction(String action, Object value) {
                switch (action.toLowerCase()) {
                        case "toggle":
                                toggle();
                                break;
                        case "brightness":
                                setBrightness((Integer) value);
                                break;
                        case "color":
                                setColorHex((String) value);
                                break;
                        default:
                                throw new IllegalArgumentException("Unknown action: " + action);
                }
        }

        // Light-specific methods
        public void toggle() {
                if (isOn()) {
                        turnOff();
                } else {
                        turnOn();
                }
        }

        public void setBrightnessAndColor(Integer brightness, String colorHex) {
                setBrightness(brightness);
                setColorHex(colorHex);
                if (brightness > 0) {
                        turnOn();
                }
        }

        // Getters and setters
        public int getBrightness() {
                return brightness;
        }

        public void setBrightness(Integer brightness) {
                this.brightness = Math.max(0, Math.min(100, brightness));
                if (this.brightness > 0) {
                        turnOn();
                } else {
                        turnOff();
                }
        }

        public String getColorHex() {
                return colorHex;
        }

        public void setColorHex(String colorHex) {
                this.colorHex = colorHex;
        }
}

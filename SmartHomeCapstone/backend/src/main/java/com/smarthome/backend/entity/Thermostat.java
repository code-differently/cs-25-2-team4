package com.smarthome.backend.entity;

import com.smarthome.backend.enums.ThermostatMode;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "thermostat_properties")
@DiscriminatorValue("THERMOSTAT")
@PrimaryKeyJoinColumn(name = "device_id")
public class Thermostat extends Device {

        @Column(name = "current_temp")
        @DecimalMin(value = "50.0")
        @DecimalMax(value = "100.0")
        private Double currentTemp;

        @Column(name = "target_temp")
        @DecimalMin(value = "50.0")
        @DecimalMax(value = "100.0")
        private Double targetTemp = 20.0; // Default 20°F

        @Enumerated(EnumType.STRING)
        @Column(name = "thermostat_mode", length = 20)
        private ThermostatMode mode = ThermostatMode.AUTO;

        // Constructors
        public Thermostat() {}

        public Thermostat(String deviceName, Room room) {
                super(deviceName, room);
        }

        public Thermostat(String deviceName, Room room, Double targetTemp) {
                super(deviceName, room);
                this.targetTemp = targetTemp;
        }

        // Abstract method implementations
        @Override
        public String getDeviceInfo() {
                return String.format(
                                "Thermostat: %s | Current: %.2f°F | Target: %.2f°F | Mode: %s",
                                getDeviceName(), currentTemp, targetTemp, mode);
        }

        @Override
        public void performAction(String action, Object value) {
                switch (action.toLowerCase()) {
                        case "temperature":
                                setTargetTemp((Double) value);
                                break;
                        case "mode":
                                setMode((ThermostatMode) value);
                                break;
                        case "increase":
                                adjustTemperature(1.0);
                                break;
                        case "decrease":
                                adjustTemperature(-1.0);
                                break;
                        default:
                                throw new IllegalArgumentException("Unknown action: " + action);
                }
        }

        // Thermostat-specific method
        public void adjustTemperature(Double adjustment) {
                setTargetTemp(targetTemp + adjustment);
                turnOn();
        }

        @Override
        public void turnOff() {
                super.turnOff();
                setMode(ThermostatMode.OFF);
        }

        // Getters and setters
        public Double getCurrentTemp() {
                return currentTemp;
        }

        public void setCurrentTemp(Double currentTemp) {
                this.currentTemp = currentTemp;
        }

        public Double getTargetTemp() {
                return targetTemp;
        }

        public void setTargetTemp(Double targetTemp) {
                // Temperature range: 50-100°F
                this.targetTemp = Math.max(50.0, Math.min(100.0, targetTemp));
        }

        public ThermostatMode getMode() {
                return mode;
        }

        public void setMode(ThermostatMode mode) {
                this.mode = mode;
                if (mode == ThermostatMode.OFF) {
                        turnOff();
                } else {
                        turnOn();
                }
        }
}

package com.smarthome.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DeviceCreateRequest {

    @NotBlank(message = "Device name is required")
    @Size(min = 1, max = 100, message = "Device name must be between 1 and 100 characters")
    private String deviceName;

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotBlank(message = "Device type is required")
    private String deviceType; // "LIGHT", "THERMOSTAT", "CAMERA"

    // Type-specific properties
    // For lights
    private Integer brightness;
    private String colorHex;
    // For thermostats
    private Double temperature;
    // For cameras
    private String streamUrl;
    private String resolution;

    // Constructors
    public DeviceCreateRequest() {}

    public DeviceCreateRequest(String deviceName, Long roomId, String deviceType) {
        this.deviceName = deviceName;
        this.roomId = roomId;
        this.deviceType = deviceType;
    }

    // Getters and setters
    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public Integer getBrightness() {
        return brightness;
    }

    public void setBrightness(Integer brightness) {
        this.brightness = brightness;
    }

    public String getColorHex() {
        return colorHex;
    }

    public void setColorHex(String colorHex) {
        this.colorHex = colorHex;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getStreamUrl() {
        return streamUrl;
    }

    public void setStreamUrl(String streamUrl) {
        this.streamUrl = streamUrl;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }
}
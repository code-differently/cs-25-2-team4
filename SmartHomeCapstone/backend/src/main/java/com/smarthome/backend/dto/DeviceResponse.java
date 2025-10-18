package com.smarthome.backend.dto;

import com.smarthome.backend.entity.*;
import java.time.LocalDateTime;

public class DeviceResponse {

    private Long deviceId;
    private String deviceName;
    private String deviceType;
    private Boolean isOn;
    private Long roomId;
    private String roomName;

    // Type-specific properties
    // For lights
    private Integer brightness;     
    private String colorHex;        
    // For thermostats
    private Double temperature;     
    private Double targetTemp;      
    // For cameras
    private String streamUrl;       
    private Boolean isRecording;    
    private String resolution;      

    // Constructors
    public DeviceResponse() {}

    public DeviceResponse(Device device) {
        this.deviceId = device.getDeviceId();
        this.deviceName = device.getDeviceName();
        this.deviceType = device.getClass().getSimpleName().toUpperCase();
        this.isOn = device.isOn();
        this.roomId = device.getRoom().getRoomId();
        this.roomName = device.getRoom().getName();

        // Set type-specific properties
        if (device instanceof Light light) {
            this.brightness = light.getBrightness();
            this.colorHex = light.getColorHex();
        } else if (device instanceof Thermostat thermostat) {
            this.temperature = thermostat.getCurrentTemp();
            this.targetTemp = thermostat.getTargetTemp();
        } else if (device instanceof SecurityCamera camera) {
            this.streamUrl = camera.getStreamUrl();
            this.isRecording = camera.getIsRecording();
            this.resolution = camera.getResolution();
        }
    }

    // Getters and setters
    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public Boolean getIsOn() {
        return isOn;
    }

    public void setIsOn(Boolean isOn) {
        this.isOn = isOn;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
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

    public Double getTargetTemp() {
        return targetTemp;
    }

    public void setTargetTemp(Double targetTemp) {
        this.targetTemp = targetTemp;
    }

    public String getStreamUrl() {
        return streamUrl;
    }

    public void setStreamUrl(String streamUrl) {
        this.streamUrl = streamUrl;
    }

    public Boolean getIsRecording() {
        return isRecording;
    }

    public void setIsRecording(Boolean isRecording) {
        this.isRecording = isRecording;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }
}
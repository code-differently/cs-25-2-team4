package com.smarthome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "camera_properties")
@DiscriminatorValue("CAMERA")
@PrimaryKeyJoinColumn(name = "device_id")
public class SecurityCamera extends Device {

        @Column(name = "stream_url")
        @Size(max = 255, message = "Stream URL cannot exceed 255 characters")
        private String streamUrl;

        @Column(name = "is_recording")
        private Boolean isRecording = false;

        @Column(name = "resolution", length = 20)
        @Size(max = 20, message = "Resolution cannot exceed 20 characters")
        private String resolution = "1080p";

        @Column(name = "motion_detection")
        private Boolean motionDetection = true;

        // Constructors
        public SecurityCamera() {}

        public SecurityCamera(String deviceName, Room room) {
                super(deviceName, room);
        }

        public SecurityCamera(String deviceName, Room room, String streamUrl) {
                super(deviceName, room);
                this.streamUrl = streamUrl;
        }

        public SecurityCamera(String deviceName, Room room, String streamUrl, String resolution) {
                super(deviceName, room);
                this.streamUrl = streamUrl;
                this.resolution = resolution;
        }

        // Abstract method implementations
        @Override
        public String getDeviceInfo() {
                return String.format(
                                "Camera: %s | Resolution: %s | Recording: %s",
                                getDeviceName(), resolution, isRecording ? "ON" : "OFF");
        }

        @Override
        public void performAction(String action, Object value) {
                switch (action.toLowerCase()) {
                        case "record":
                                setIsRecording((Boolean) value);
                                break;
                        case "motion_detection":
                                setMotionDetection((Boolean) value);
                                break;
                        case "resolution":
                                setResolution((String) value);
                                break;
                        default:
                                throw new IllegalArgumentException("Unknown action: " + action);
                }
        }

        // Camera-specific methods
        public void startRecording() {
                this.isRecording = true;
                turnOn(); // Camera is "on" when recording
        }

        public void stopRecording() {
                this.isRecording = false;
        }

        public void enableMotionDetection() {
                this.motionDetection = true;
                turnOn();
        }

        public void disableMotionDetection() {
                this.motionDetection = false;
        }

        @Override
        public void turnOn() {
                super.turnOn();
                // Camera is considered "on" when it's actively monitoring
        }

        @Override
        public void turnOff() {
                super.turnOff();
                // When camera is off, stop recording
                this.isRecording = false;
        }

        // Getters and setters
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
                if (isRecording) {
                        turnOn();
                }
        }

        public String getResolution() {
                return resolution;
        }

        public void setResolution(String resolution) {
                this.resolution = resolution;
        }

        public Boolean getMotionDetection() {
                return motionDetection;
        }

        public void setMotionDetection(Boolean motionDetection) {
                this.motionDetection = motionDetection;
        }
}

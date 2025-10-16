package com.smarthome.backend.entity;

import jakarta.persistence.*;
import com.smarthome.backend.enums.DeviceStatus;

@Entity
@Table(name = "device")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "device_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Device {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Long deviceId;
    
    @Column(name = "device_name", nullable = false, length = 100)
    private String deviceName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private DeviceStatus status = DeviceStatus.OFF;
    
    // Constructors
    public Device() {}
    
    public Device(String deviceName, Room room) {
        this();
        this.deviceName = deviceName;
        this.room = room;
    }
    
    // Abstract methods for polymorphism
    public abstract String getDeviceInfo();
    public abstract void performAction(String action, Object value);
    
    // Common device methods
    public void turnOn() {
        this.status = DeviceStatus.ON;
    }
    
    public void turnOff() {
        this.status = DeviceStatus.OFF;
    }
    
    public boolean isOn() {
        return this.status == DeviceStatus.ON;
    }
    
    // Getters and Setters
    public Long getDeviceId() {
        return deviceId;
    }
    
    public String getDeviceName() {
        return deviceName;
    }
    
    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }
    
    public Room getRoom() {
        return room;
    }
    
    public void setRoom(Room room) {
        this.room = room;
    }
    
    public DeviceStatus getStatus() {
        return status;
    }
    
    public void setStatus(DeviceStatus status) {
        this.status = status;
    }
}
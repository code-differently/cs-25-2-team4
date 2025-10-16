package com.smarthome.backend.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "Room")
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_id", nullable = false)
    private Home home;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    // Relationships
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Device> devices;
    
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<RoomAccess> roomAccesses;
    
    // Constructors
    public Room() {}
    
    public Room(Home home, String name) {
        this.home = home;
        this.name = name;
    }
    
    // Getters and Setters
    public Long getRoomId() {
        return roomId;
    }
    
    public Home getHome() {
        return home;
    }
    
    public void setHome(Home home) {
        this.home = home;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Set<Device> getDevices() {
        return devices;
    }
    
    public void setDevices(Set<Device> devices) {
        this.devices = devices;
    }
    
    public Set<RoomAccess> getRoomAccesses() {
        return roomAccesses;
    }
}
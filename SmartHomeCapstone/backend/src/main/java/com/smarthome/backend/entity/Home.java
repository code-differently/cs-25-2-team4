package com.smarthome.backend.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "Home")
public class Home {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "home_id")
    private Long homeId;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "address", length = 255)
    private String address;
    
    // Relationships
    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<HomeMembership> homeMemberships;
    
    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Room> rooms;
    
    // Constructors
    public Home() {}
    
    public Home(String name, String address) {
        this.name = name;
        this.address = address;
    }
    
    // Getters and Setters
    public Long getHomeId() {
        return homeId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Set<HomeMembership> getHomeMemberships() {
        return homeMemberships;
    }
    
    public void setHomeMemberships(Set<HomeMembership> homeMemberships) {
        this.homeMemberships = homeMemberships;
    }
    
    public Set<Room> getRooms() {
        return rooms;
    }
    
    public void setRooms(Set<Room> rooms) {
        this.rooms = rooms;
    }
}
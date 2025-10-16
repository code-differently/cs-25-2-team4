package com.smarthome.backend.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "\"User\"") // Using quotes because User is a reserved keyword in some databases
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "username", nullable = false, unique = true, length = 100)
    private String username;
    
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<HomeMembership> homeMemberships;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<RoomAccess> roomAccesses;
    
    // Constructors
    public User() {}
    
    public User(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPasswordHash() {
        return passwordHash;
    }
    
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    
    public Set<HomeMembership> getHomeMemberships() {
        return homeMemberships;
    }
    
    public void setHomeMemberships(Set<HomeMembership> homeMemberships) {
        this.homeMemberships = homeMemberships;
    }
    
    public Set<RoomAccess> getRoomAccesses() {
        return roomAccesses;
    }
    
    public void setRoomAccesses(Set<RoomAccess> roomAccesses) {
        this.roomAccesses = roomAccesses;
    }
    
    // Convenience methods for managing relationships
    public void addHomeMembership(HomeMembership membership) {
        if (this.homeMemberships == null) {
            this.homeMemberships = new HashSet<>();
        }
        this.homeMemberships.add(membership);
        membership.setUser(this);
    }
    
    public void removeHomeMembership(HomeMembership membership) {
        if (this.homeMemberships != null) {
            this.homeMemberships.remove(membership);
            membership.setUser(null);
        }
    }
    
    public void addRoomAccess(RoomAccess roomAccess) {
        if (this.roomAccesses == null) {
            this.roomAccesses = new HashSet<>();
        }
        this.roomAccesses.add(roomAccess);
        roomAccess.setUser(this);
    }
    
    public void removeRoomAccess(RoomAccess roomAccess) {
        if (this.roomAccesses != null) {
            this.roomAccesses.remove(roomAccess);
            roomAccess.setUser(null);
        }
    }
}
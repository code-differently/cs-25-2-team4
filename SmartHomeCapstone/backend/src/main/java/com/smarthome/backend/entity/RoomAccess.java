package com.smarthome.backend.entity;

import jakarta.persistence.*;
import com.smarthome.backend.enums.Permission;

@Entity
@Table(name = "RoomAccess", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "room_id"})
})
public class RoomAccess {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "access_id")
    private Long accessId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "permission", length = 50)
    private Permission permission = Permission.READ; // Default value: READ
    
    // Constructors
    public RoomAccess() {}
    
    public RoomAccess(User user, Room room, Permission permission) {
        this.user = user;
        this.room = room;
        this.permission = permission;
    }
    
    public RoomAccess(User user, Room room) {
        this.user = user;
        this.room = room;
        this.permission = Permission.READ; // Default permission
    }
    
    // Getters and Setters
    public Long getAccessId() {
        return accessId;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Room getRoom() {
        return room;
    }
    
    public void setRoom(Room room) {
        this.room = room;
    }
    
    public Permission getPermission() {
        return permission;
    }
    
    public void setPermission(Permission permission) {
        this.permission = permission;
    }
}
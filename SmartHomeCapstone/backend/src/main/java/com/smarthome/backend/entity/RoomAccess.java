package com.smarthome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smarthome.backend.enums.Permission;
import java.util.Objects;

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
    @NotNull(message = "User cannot be null")
    @JsonIgnore
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @NotNull(message = "Room cannot be null")
    @JsonIgnore
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
    
    // toString, equals, and hashCode
    @Override
    public String toString() {
        return "RoomAccess{" +
                "accessId=" + accessId +
                ", userId=" + (user != null ? user.getUserId() : null) +
                ", roomId=" + (room != null ? room.getRoomId() : null) +
                ", permission=" + permission +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RoomAccess that = (RoomAccess) o;
        return Objects.equals(accessId, that.accessId) &&
               Objects.equals(user != null ? user.getUserId() : null,
                            that.user != null ? that.user.getUserId() : null) &&
               Objects.equals(room != null ? room.getRoomId() : null,
                            that.room != null ? that.room.getRoomId() : null) &&
               permission == that.permission;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(accessId,
                          user != null ? user.getUserId() : null,
                          room != null ? room.getRoomId() : null,
                          permission);
    }
}
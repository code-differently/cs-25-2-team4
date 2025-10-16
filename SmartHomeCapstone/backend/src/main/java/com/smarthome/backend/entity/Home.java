package com.smarthome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "Home")
public class Home {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "home_id")
    private Long homeId;
    
    @Column(name = "name", nullable = false, length = 100)
    @NotBlank(message = "Home name cannot be blank")
    @Size(min = 1, max = 100, message = "Home name must be between 1 and 100 characters")
    private String name;
    
    @Column(name = "address", length = 255)
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;
    
    // Relationships
    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<HomeMembership> homeMemberships;
    
    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
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
    
    // Convenience methods for managing relationships
    public void addHomeMembership(HomeMembership membership) {
        if (this.homeMemberships == null) {
            this.homeMemberships = new HashSet<>();
        }
        this.homeMemberships.add(membership);
        membership.setHome(this);
    }
    
    public void removeHomeMembership(HomeMembership membership) {
        if (this.homeMemberships != null) {
            this.homeMemberships.remove(membership);
            membership.setHome(null);
        }
    }
    
    public void addRoom(Room room) {
        if (this.rooms == null) {
            this.rooms = new HashSet<>();
        }
        this.rooms.add(room);
        room.setHome(this);
    }
    
    public void removeRoom(Room room) {
        if (this.rooms != null) {
            this.rooms.remove(room);
            room.setHome(null);
        }
    }
    
    // toString, equals, and hashCode
    @Override
    public String toString() {
        return "Home{" +
                "homeId=" + homeId +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Home home = (Home) o;
        return Objects.equals(homeId, home.homeId) &&
               Objects.equals(name, home.name) &&
               Objects.equals(address, home.address);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(homeId, name, address);
    }
}
package com.smarthome.backend.entity;

import jakarta.persistence.*;
import com.smarthome.backend.enums.MembershipRole;

@Entity
@Table(name = "HomeMembership", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "home_id"})
})
public class HomeMembership {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "membership_id")
    private Long membershipId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_id", nullable = false)
    private Home home;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 50)
    private MembershipRole role = MembershipRole.MEMBER; // Default value: MEMBER
    
    // Constructors
    public HomeMembership() {}
    
    public HomeMembership(User user, Home home, MembershipRole role) {
        this.user = user;
        this.home = home;
        this.role = role;
    }
    
    public HomeMembership(User user, Home home) {
        this.user = user;
        this.home = home;
        this.role = MembershipRole.MEMBER; // Default role
    }
    
    // Getters and Setters
    public Long getMembershipId() {
        return membershipId;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Home getHome() {
        return home;
    }
    
    public void setHome(Home home) {
        this.home = home;
    }
    
    public MembershipRole getRole() {
        return role;
    }
    
    public void setRole(MembershipRole role) {
        this.role = role;
    }
}
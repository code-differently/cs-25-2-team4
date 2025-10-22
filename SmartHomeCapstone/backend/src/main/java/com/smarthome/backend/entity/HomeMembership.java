package com.smarthome.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smarthome.backend.enums.MembershipRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Objects;

@Entity
@Table(
                name = "HomeMembership",
                uniqueConstraints = {@UniqueConstraint(columnNames = {"username", "home_id"})})
public class HomeMembership {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "membership_id")
        private Long membershipId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "username", nullable = false)
        @NotNull(message = "User cannot be null")
        @JsonIgnore
        private User user;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "home_id", nullable = false)
        @NotNull(message = "Home cannot be null")
        @JsonIgnore
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

        // toString, equals, and hashCode
        @Override
        public String toString() {
                return "HomeMembership{"
                                + "membershipId="
                                + membershipId
                                + ", username="
                                + (user != null ? user.getUsername() : null)
                                + ", homeId="
                                + (home != null ? home.getHomeId() : null)
                                + ", role="
                                + role
                                + '}';
        }

        @Override
        public boolean equals(Object o) {
                if (this == o) return true;
                if (o == null || getClass() != o.getClass()) return false;
                HomeMembership that = (HomeMembership) o;
                return Objects.equals(membershipId, that.membershipId)
                                && Objects.equals(
                                                user != null ? user.getUsername() : null,
                                                that.user != null ? that.user.getUsername() : null)
                                && Objects.equals(
                                                home != null ? home.getHomeId() : null,
                                                that.home != null ? that.home.getHomeId() : null)
                                && role == that.role;
        }

        @Override
        public int hashCode() {
                return Objects.hash(
                                membershipId,
                                user != null ? user.getUsername() : null,
                                home != null ? home.getHomeId() : null,
                                role);
        }
}

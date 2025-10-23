package com.smarthome.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "\"User\"") // Using quotes because User is a reserved keyword in some databases
public class User {

        @Id
        @Column(name = "clerk_id", nullable = false, length = 100)
        @NotBlank(message = "Clerk ID cannot be blank")
        @Size(max = 100, message = "Clerk ID must be at most 100 characters")
        private String clerkId;

        @Column(name = "username", nullable = false, unique = true, length = 100)
        @NotBlank(message = "Username cannot be blank")
        @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
        private String username;

        @Column(name = "full_name", nullable = false, length = 200)
        @NotBlank(message = "Full name cannot be blank")
        @Size(max = 200, message = "Full name must be at most 200 characters")
        private String fullName;

        @Column(name = "email", nullable = false, unique = true, length = 255)
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        @Size(max = 255)
        private String email;

        // Relationships
        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private Set<HomeMembership> homeMemberships;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private Set<RoomAccess> roomAccesses;

        // Constructors
        public User() {}

        public User(String clerkId, String username, String fullName, String email) {
                this.clerkId = clerkId;
                this.username = username;
                this.fullName = fullName;
                this.email = email;
        }

        // Getters and Setters
        public String getClerkId() {
                return clerkId;
        }

        public void setClerkId(String clerkId) {
                this.clerkId = clerkId;
        }

        public String getUserId() {
                return clerkId;
        }

        public String getUsername() {
                return username;
        }

        public void setUsername(String username) {
                this.username = username;
        }

        public String getFullName() {
                return fullName;
        }

        public void setFullName(String fullName) {
                this.fullName = fullName;
        }

        // Convenience methods to get parsed first and last names
        public String getFirstName() {
                if (fullName == null || fullName.trim().isEmpty()) {
                        return "";
                }
                String[] parts = fullName.trim().split("\\s+");
                return parts[0];
        }

        public String getLastName() {
                if (fullName == null || fullName.trim().isEmpty()) {
                        return "";
                }
                String[] parts = fullName.trim().split("\\s+");
                if (parts.length > 1) {
                        return String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length));
                }
                return "";
        }

        // For backward compatibility, add setters that construct fullName
        public void setFirstName(String firstName) {
                String lastName = getLastName();
                this.fullName = (firstName + " " + lastName).trim();
        }

        public void setLastName(String lastName) {
                String firstName = getFirstName();
                this.fullName = (firstName + " " + lastName).trim();
        }

        public String getEmail() {
                return email;
        }

        public void setEmail(String email) {
                this.email = email;
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

        // toString, equals, and hashCode
        @Override
        public String toString() {
                return "User{"
                                + "clerkId='"
                                + clerkId
                                + '\''
                                + ", username='"
                                + username
                                + '\''
                                + ", fullName='"
                                + fullName
                                + '\''
                                + ", email='"
                                + email
                                + '\''
                                + '}';
        }

        @Override
        public boolean equals(Object o) {
                if (this == o) return true;
                if (o == null || getClass() != o.getClass()) return false;
                User user = (User) o;
                return Objects.equals(clerkId, user.clerkId)
                                && Objects.equals(username, user.username)
                                && Objects.equals(fullName, user.fullName)
                                && Objects.equals(email, user.email);
        }

        @Override
        public int hashCode() {
                return Objects.hash(clerkId, username, fullName, email);
        }
}

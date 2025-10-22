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
        @Column(name = "username", nullable = false, length = 100)
        @NotBlank(message = "Username cannot be blank")
        @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
        private String username;

        @Column(name = "first_name", nullable = false, length = 100)
        @NotBlank(message = "First name cannot be blank")
        @Size(max = 100, message = "First name must be at most 100 characters")
        private String firstName;

        @Column(name = "last_name", nullable = false, length = 100)
        @NotBlank(message = "Last name cannot be blank")
        @Size(max = 100, message = "Last name must be at most 100 characters")
        private String lastName;

        @Column(name = "email", nullable = false, unique = true, length = 255)
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Email should be valid")
        @Size(max = 255)
        private String email;

        @Column(name = "password_hash", nullable = false, length = 255)
        @NotBlank(message = "Password cannot be blank")
        @Size(max = 255)
        private String passwordHash;

        // Relationships
        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private Set<HomeMembership> homeMemberships;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private Set<RoomAccess> roomAccesses;

        // Constructors
        public User() {}

        public User(String username, String firstName, String lastName, String email, String passwordHash) {
                this.username = username;
                this.firstName = firstName;
                this.lastName = lastName;
                this.email = email;
                this.passwordHash = passwordHash;
        }

        // Getters and Setters
        public String getUserId() {
                return username;
        }

        public String getUsername() {
                return username;
        }

        public void setUsername(String username) {
                this.username = username;
        }

        public String getFirstName() {
                return firstName;
        }

        public void setFirstName(String firstName) {
                this.firstName = firstName;
        }

        public String getLastName() {
                return lastName;
        }

        public void setLastName(String lastName) {
                this.lastName = lastName;
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

        // toString, equals, and hashCode
        @Override
        public String toString() {
                return "User{"
                                + "username='"
                                + username
                                + '\''
                                + ", firstName='"
                                + firstName
                                + '\''
                                + ", lastName='"
                                + lastName
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
                return Objects.equals(username, user.username)
                                && Objects.equals(firstName, user.firstName)
                                && Objects.equals(lastName, user.lastName)
                                && Objects.equals(email, user.email);
        }

        @Override
        public int hashCode() {
                return Objects.hash(username, firstName, lastName, email);
        }
}

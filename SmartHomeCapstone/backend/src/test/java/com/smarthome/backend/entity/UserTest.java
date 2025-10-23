package com.smarthome.backend.entity;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.backend.enums.MembershipRole;
import com.smarthome.backend.enums.Permission;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("User Entity Tests")
class UserTest {

        private Validator validator;
        private User user;

        @BeforeEach
        void setUp() {
                ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
                validator = factory.getValidator();
                user = new User();
        }

        @Test
        @DisplayName("Default constructor creates empty user")
        void defaultConstructor_ShouldCreateEmptyUser() {
                User newUser = new User();

                assertNull(newUser.getClerkId());
                assertNull(newUser.getUsername());
                assertNull(newUser.getFirstName());
                assertNull(newUser.getLastName());
                assertNull(newUser.getEmail());
                assertNull(newUser.getHomeMemberships());
                assertNull(newUser.getRoomAccesses());
        }

        @Test
        @DisplayName("Parameterized constructor sets fields correctly")
        void parameterizedConstructor_ShouldSetFields() {
                String clerkId = "clerk_123456789";
                String username = "testuser";
                String firstName = "John";
                String lastName = "Doe";
                String email = "test@example.com";

                User newUser = new User(clerkId, username, firstName, lastName, email);

                assertEquals(clerkId, newUser.getClerkId());
                assertEquals(username, newUser.getUsername());
                assertEquals(firstName, newUser.getFirstName());
                assertEquals(lastName, newUser.getLastName());
                assertEquals(email, newUser.getEmail());
        }

        @Test
        @DisplayName("Valid user passes validation")
        void validUser_ShouldPassValidation() {
                user.setClerkId("clerk_123456789");
                user.setUsername("validuser");
                user.setFirstName("John");
                user.setLastName("Doe");
                user.setEmail("valid@example.com");

                Set<ConstraintViolation<User>> violations = validator.validate(user);

                assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("ClerkId validation tests")
        void clerkIdValidation_ShouldEnforceConstraints() {
                user.setUsername("validuser");
                user.setFirstName("John");
                user.setLastName("Doe");
                user.setEmail("valid@example.com");

                // Test blank clerkId
                user.setClerkId("");
                Set<ConstraintViolation<User>> violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(v -> v.getMessage().contains("Clerk ID cannot be blank")));

                // Test clerkId too long
                user.setClerkId("a".repeat(101));
                violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "Clerk ID must be at most 100"
                                                                                                                                + " characters")));
        }

        @Test
        @DisplayName("Username validation tests")
        void usernameValidation_ShouldEnforceConstraints() {
                user.setClerkId("clerk_123456789");
                user.setFirstName("John");
                user.setLastName("Doe");
                user.setEmail("valid@example.com");

                // Test blank username
                user.setUsername("");
                Set<ConstraintViolation<User>> violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(v -> v.getMessage().contains("Username cannot be blank")));

                // Test username too short
                user.setUsername("ab");
                violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "Username must be between 3 and 100"
                                                                                                                                + " characters")));

                // Test username too long
                user.setUsername("a".repeat(101));
                violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "Username must be between 3 and 100"
                                                                                                                                + " characters")));
        }

        @Test
        @DisplayName("First name validation tests")
        void firstNameValidation_ShouldEnforceConstraints() {
                user.setClerkId("clerk_123456789");
                user.setUsername("validuser");
                user.setLastName("Doe");
                user.setEmail("valid@example.com");

                // Test blank first name
                user.setFirstName("");
                Set<ConstraintViolation<User>> violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(v -> v.getMessage().contains("First name cannot be blank")));

                // Test first name too long
                user.setFirstName("a".repeat(101));
                violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "First name must be at most 100"
                                                                                                                                + " characters")));
        }

        @Test
        @DisplayName("Last name validation tests")
        void lastNameValidation_ShouldEnforceConstraints() {
                user.setClerkId("clerk_123456789");
                user.setUsername("validuser");
                user.setFirstName("John");
                user.setEmail("valid@example.com");

                // Test blank last name
                user.setLastName("");
                Set<ConstraintViolation<User>> violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(v -> v.getMessage().contains("Last name cannot be blank")));

                // Test last name too long
                user.setLastName("a".repeat(101));
                violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "Last name must be at most 100"
                                                                                                                                + " characters")));
        }

        @Test
        @DisplayName("Email validation tests")
        void emailValidation_ShouldEnforceConstraints() {
                user.setClerkId("clerk_123456789");
                user.setUsername("validuser");
                user.setFirstName("John");
                user.setLastName("Doe");

                // Test blank email
                user.setEmail("");
                Set<ConstraintViolation<User>> violations = validator.validate(user);
                assertFalse(violations.isEmpty(), "Blank email should produce violations");

                // Test invalid email format
                user.setEmail("invalid-email");
                violations = validator.validate(user);
                assertFalse(violations.isEmpty(), "Invalid email format should produce violations");

                // Test email too long
                user.setEmail("a".repeat(250) + "@example.com");
                violations = validator.validate(user);
                assertFalse(violations.isEmpty(), "Too long email should produce violations");
        }

        @Test
        @DisplayName("Add home membership convenience method")
        void addHomeMembership_ShouldAddAndSetBidirectionalRelationship() {
                Home home = new Home("Test Home", "123 Test St");
                HomeMembership membership = new HomeMembership(user, home, MembershipRole.ADMIN);

                user.addHomeMembership(membership);

                assertNotNull(user.getHomeMemberships());
                assertTrue(user.getHomeMemberships().contains(membership));
                assertEquals(user, membership.getUser());
        }

        @Test
        @DisplayName("Remove home membership convenience method")
        void removeHomeMembership_ShouldRemoveAndClearRelationship() {
                Home home = new Home("Test Home", "123 Test St");
                HomeMembership membership = new HomeMembership(user, home, MembershipRole.ADMIN);

                user.addHomeMembership(membership);
                user.removeHomeMembership(membership);

                assertFalse(user.getHomeMemberships().contains(membership));
                assertNull(membership.getUser());
        }

        @Test
        @DisplayName("Add room access convenience method")
        void addRoomAccess_ShouldAddAndSetBidirectionalRelationship() {
                Home home = new Home("Test Home", "123 Test St");
                Room room = new Room(home, "Test Room");
                RoomAccess roomAccess = new RoomAccess(user, room, Permission.WRITE);

                user.addRoomAccess(roomAccess);

                assertNotNull(user.getRoomAccesses());
                assertTrue(user.getRoomAccesses().contains(roomAccess));
                assertEquals(user, roomAccess.getUser());
        }

        @Test
        @DisplayName("Remove room access convenience method")
        void removeRoomAccess_ShouldRemoveAndClearRelationship() {
                Home home = new Home("Test Home", "123 Test St");
                Room room = new Room(home, "Test Room");
                RoomAccess roomAccess = new RoomAccess(user, room, Permission.WRITE);

                user.addRoomAccess(roomAccess);
                user.removeRoomAccess(roomAccess);

                assertFalse(user.getRoomAccesses().contains(roomAccess));
                assertNull(roomAccess.getUser());
        }

        @Test
        @DisplayName("Convenience methods handle null collections")
        void convenienceMethods_ShouldHandleNullCollections() {
                // Test that methods work when collections are null
                Home home = new Home("Test Home", "123 Test St");
                HomeMembership membership = new HomeMembership(user, home, MembershipRole.MEMBER);

                assertNull(user.getHomeMemberships());

                user.addHomeMembership(membership);

                assertNotNull(user.getHomeMemberships());
                assertTrue(user.getHomeMemberships().contains(membership));

                // Test remove when collection exists
                user.removeHomeMembership(membership);
                assertFalse(user.getHomeMemberships().contains(membership));

                // Test remove when collection is null (shouldn't throw exception)
                user.setHomeMemberships(null);
                assertDoesNotThrow(() -> user.removeHomeMembership(membership));
        }
}

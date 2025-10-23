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
                assertNull(newUser.getFullName());
                assertNull(newUser.getEmail());
                assertNull(newUser.getHomeMemberships());
                assertNull(newUser.getRoomAccesses());
        }

        @Test
        @DisplayName("Parameterized constructor sets fields correctly")
        void parameterizedConstructor_ShouldSetFields() {
                String clerkId = "clerk_123456789";
                String username = "testuser";
                String fullName = "John Doe";
                String email = "test@example.com";

                User newUser = new User(clerkId, username, fullName, email);

                assertEquals(clerkId, newUser.getClerkId());
                assertEquals(username, newUser.getUsername());
                assertEquals(fullName, newUser.getFullName());
                assertEquals("John", newUser.getFirstName());
                assertEquals("Doe", newUser.getLastName());
                assertEquals(email, newUser.getEmail());
        }

        @Test
        @DisplayName("Valid user passes validation")
        void validUser_ShouldPassValidation() {
                user.setClerkId("clerk_123456789");
                user.setUsername("validuser");
                user.setFullName("John Doe");
                user.setEmail("valid@example.com");

                Set<ConstraintViolation<User>> violations = validator.validate(user);

                assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("ClerkId validation tests")
        void clerkIdValidation_ShouldEnforceConstraints() {
                user.setUsername("validuser");
                user.setFullName("John Doe");
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
                user.setFullName("John Doe");
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
        @DisplayName("Full name validation tests")
        void fullNameValidation_ShouldEnforceConstraints() {
                user.setClerkId("clerk_123456789");
                user.setUsername("validuser");
                user.setEmail("valid@example.com");

                // Test blank full name
                user.setFullName("");
                Set<ConstraintViolation<User>> violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(v -> v.getMessage().contains("Full name cannot be blank")));

                // Test full name too long
                user.setFullName("a".repeat(201));
                violations = validator.validate(user);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "Full name must be at most 200"
                                                                                                                                + " characters")));
        }

        @Test
        @DisplayName("First and last name parsing tests")
        void nameParsingTests_ShouldParseCorrectly() {
                // Test single name
                user.setFullName("John");
                assertEquals("John", user.getFirstName());
                assertEquals("", user.getLastName());

                // Test two names
                user.setFullName("John Doe");
                assertEquals("John", user.getFirstName());
                assertEquals("Doe", user.getLastName());

                // Test three names
                user.setFullName("John Michael Doe");
                assertEquals("John", user.getFirstName());
                assertEquals("Michael Doe", user.getLastName());

                // Test empty name
                user.setFullName("");
                assertEquals("", user.getFirstName());
                assertEquals("", user.getLastName());

                // Test null name
                user.setFullName(null);
                assertEquals("", user.getFirstName());
                assertEquals("", user.getLastName());
        }

        @Test
        @DisplayName("Email validation tests")
        void emailValidation_ShouldEnforceConstraints() {
                user.setClerkId("clerk_123456789");
                user.setUsername("validuser");
                user.setFullName("John Doe");

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

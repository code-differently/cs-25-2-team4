package com.smarthome.backend.entity;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.backend.enums.MembershipRole;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("Home Entity Tests")
class HomeTest {

        private Validator validator;
        private Home home;

        @BeforeEach
        void setUp() {
                ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
                validator = factory.getValidator();
                home = new Home();
        }

        @Test
        @DisplayName("Default constructor creates empty home")
        void defaultConstructor_ShouldCreateEmptyHome() {
                Home newHome = new Home();

                assertNull(newHome.getHomeId());
                assertNull(newHome.getName());
                assertNull(newHome.getAddress());
                assertNull(newHome.getHomeMemberships());
                assertNull(newHome.getRooms());
        }

        @Test
        @DisplayName("Parameterized constructor sets fields correctly")
        void parameterizedConstructor_ShouldSetFields() {
                String name = "Test Home";
                String address = "123 Test Street";

                Home newHome = new Home(name, address);

                assertEquals(name, newHome.getName());
                assertEquals(address, newHome.getAddress());
                assertNull(newHome.getHomeId()); // ID is generated
        }

        @Test
        @DisplayName("Valid home passes validation")
        void validHome_ShouldPassValidation() {
                home.setName("Valid Home");
                home.setAddress("123 Valid Street");

                Set<ConstraintViolation<Home>> violations = validator.validate(home);

                assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("Name validation tests")
        void nameValidation_ShouldEnforceConstraints() {
                home.setAddress("123 Test Street");

                // Test blank name
                home.setName("");
                Set<ConstraintViolation<Home>> violations = validator.validate(home);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(v -> v.getMessage().contains("Home name cannot be blank")));

                // Test name too long
                home.setName("a".repeat(101));
                violations = validator.validate(home);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "Home name must be between 1 and 100"
                                                                                                                                + " characters")));
        }

        @Test
        @DisplayName("Address validation tests")
        void addressValidation_ShouldEnforceConstraints() {
                home.setName("Valid Home");

                // Test valid null address (optional field)
                home.setAddress(null);
                Set<ConstraintViolation<Home>> violations = validator.validate(home);
                assertTrue(violations.isEmpty());

                // Test address too long
                home.setAddress("a".repeat(256));
                violations = validator.validate(home);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains("Address cannot exceed 255 characters")));
        }

        @Test
        @DisplayName("Add home membership convenience method")
        void addHomeMembership_ShouldAddAndSetBidirectionalRelationship() {
                User user = new User("clerk_123456789", "testuser", "John", "Doe", "test@example.com");
                HomeMembership membership = new HomeMembership(user, home, MembershipRole.ADMIN);

                home.addHomeMembership(membership);

                assertNotNull(home.getHomeMemberships());
                assertTrue(home.getHomeMemberships().contains(membership));
                assertEquals(home, membership.getHome());
        }

        @Test
        @DisplayName("Remove home membership convenience method")
        void removeHomeMembership_ShouldRemoveAndClearRelationship() {
                User user = new User("clerk_123456789", "testuser", "John", "Doe", "test@example.com");
                HomeMembership membership = new HomeMembership(user, home, MembershipRole.ADMIN);

                home.addHomeMembership(membership);
                home.removeHomeMembership(membership);

                assertFalse(home.getHomeMemberships().contains(membership));
                assertNull(membership.getHome());
        }

        @Test
        @DisplayName("Add room convenience method")
        void addRoom_ShouldAddAndSetBidirectionalRelationship() {
                Room room = new Room(home, "Test Room");

                home.addRoom(room);

                assertNotNull(home.getRooms());
                assertTrue(home.getRooms().contains(room));
                assertEquals(home, room.getHome());
        }

        @Test
        @DisplayName("Remove room convenience method")
        void removeRoom_ShouldRemoveAndClearRelationship() {
                Room room = new Room(home, "Test Room");

                home.addRoom(room);
                home.removeRoom(room);

                assertFalse(home.getRooms().contains(room));
                assertNull(room.getHome());
        }

        @Test
        @DisplayName("Convenience methods handle null collections")
        void convenienceMethods_ShouldHandleNullCollections() {
                User user = new User("clerk_123456789", "testuser", "John", "Doe", "test@example.com");
                HomeMembership membership = new HomeMembership(user, home, MembershipRole.MEMBER);

                assertNull(home.getHomeMemberships());

                home.addHomeMembership(membership);

                assertNotNull(home.getHomeMemberships());
                assertTrue(home.getHomeMemberships().contains(membership));

                // Test remove when collection exists
                home.removeHomeMembership(membership);
                assertFalse(home.getHomeMemberships().contains(membership));

                // Test remove when collection is null (shouldn't throw exception)
                home.setHomeMemberships(null);
                assertDoesNotThrow(() -> home.removeHomeMembership(membership));
        }

        @Test
        @DisplayName("Getters and setters work correctly")
        void gettersAndSetters_ShouldWorkCorrectly() {
                String name = "My Home";
                String address = "789 My Street";

                home.setName(name);
                home.setAddress(address);

                assertEquals(name, home.getName());
                assertEquals(address, home.getAddress());
        }
}

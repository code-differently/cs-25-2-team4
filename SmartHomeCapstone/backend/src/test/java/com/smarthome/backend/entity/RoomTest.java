package com.smarthome.backend.entity;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.backend.enums.Permission;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("Room Entity Tests")
class RoomTest {

        private Validator validator;
        private Room room;
        private Home home;

        @BeforeEach
        void setUp() {
                ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
                validator = factory.getValidator();
                home = new Home("Test Home", "123 Test St");
                room = new Room();
        }

        @Test
        @DisplayName("Default constructor creates empty room")
        void defaultConstructor_ShouldCreateEmptyRoom() {
                Room newRoom = new Room();

                assertNull(newRoom.getRoomId());
                assertNull(newRoom.getHome());
                assertNull(newRoom.getName());
                assertNull(newRoom.getDevices());
                assertNull(newRoom.getRoomAccesses());
        }

        @Test
        @DisplayName("Parameterized constructor sets fields correctly")
        void parameterizedConstructor_ShouldSetFields() {
                String name = "Living Room";

                Room newRoom = new Room(home, name);

                assertEquals(home, newRoom.getHome());
                assertEquals(name, newRoom.getName());
                assertNull(newRoom.getRoomId()); // ID is generated
        }

        @Test
        @DisplayName("Valid room passes validation")
        void validRoom_ShouldPassValidation() {
                room.setHome(home);
                room.setName("Valid Room");

                Set<ConstraintViolation<Room>> violations = validator.validate(room);

                assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("Home validation tests")
        void homeValidation_ShouldEnforceConstraints() {
                room.setName("Valid Room");

                // Test null home
                room.setHome(null);
                Set<ConstraintViolation<Room>> violations = validator.validate(room);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream().anyMatch(v -> v.getMessage().contains("Home cannot be null")));
        }

        @Test
        @DisplayName("Name validation tests")
        void nameValidation_ShouldEnforceConstraints() {
                room.setHome(home);

                // Test blank name
                room.setName("");
                Set<ConstraintViolation<Room>> violations = validator.validate(room);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(v -> v.getMessage().contains("Room name cannot be blank")));

                // Test name too long
                room.setName("a".repeat(101));
                violations = validator.validate(room);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream()
                                                .anyMatch(
                                                                v ->
                                                                                v.getMessage()
                                                                                                .contains(
                                                                                                                "Room name must be between 1 and 100"
                                                                                                                                + " characters")));
        }

        @Test
        @DisplayName("Add device convenience method")
        void addDevice_ShouldAddAndSetBidirectionalRelationship() {
                Light light = new Light("Test Light", room);

                room.addDevice(light);

                assertNotNull(room.getDevices());
                assertTrue(room.getDevices().contains(light));
                assertEquals(room, light.getRoom());
        }

        @Test
        @DisplayName("Remove device convenience method")
        void removeDevice_ShouldRemoveAndClearRelationship() {
                Light light = new Light("Test Light", room);

                room.addDevice(light);
                room.removeDevice(light);

                assertFalse(room.getDevices().contains(light));
                assertNull(light.getRoom());
        }

        @Test
        @DisplayName("Add room access convenience method")
        void addRoomAccess_ShouldAddAndSetBidirectionalRelationship() {
                User user = new User("clerk_123456789", "testuser", "John", "Doe", "test@example.com");
                RoomAccess roomAccess = new RoomAccess(user, room, Permission.WRITE);

                room.addRoomAccess(roomAccess);

                assertNotNull(room.getRoomAccesses());
                assertTrue(room.getRoomAccesses().contains(roomAccess));
                assertEquals(room, roomAccess.getRoom());
        }

        @Test
        @DisplayName("Remove room access convenience method")
        void removeRoomAccess_ShouldRemoveAndClearRelationship() {
                User user = new User("clerk_123456789", "testuser", "John", "Doe", "test@example.com");
                RoomAccess roomAccess = new RoomAccess(user, room, Permission.WRITE);

                room.addRoomAccess(roomAccess);
                room.removeRoomAccess(roomAccess);

                assertFalse(room.getRoomAccesses().contains(roomAccess));
                assertNull(roomAccess.getRoom());
        }

        @Test
        @DisplayName("Convenience methods handle null collections")
        void convenienceMethods_ShouldHandleNullCollections() {
                Light light = new Light("Test Light", room);

                assertNull(room.getDevices());

                room.addDevice(light);

                assertNotNull(room.getDevices());
                assertTrue(room.getDevices().contains(light));

                // Test remove when collection exists
                room.removeDevice(light);
                assertFalse(room.getDevices().contains(light));

                // Test remove when collection is null (shouldn't throw exception)
                room.setDevices(null);
                assertDoesNotThrow(() -> room.removeDevice(light));
        }

        @Test
        @DisplayName("Getters and setters work correctly")
        void gettersAndSetters_ShouldWorkCorrectly() {
                String name = "Bedroom";
                Home newHome = new Home("New Home", "456 New St");

                room.setName(name);
                room.setHome(newHome);

                assertEquals(name, room.getName());
                assertEquals(newHome, room.getHome());
        }
}

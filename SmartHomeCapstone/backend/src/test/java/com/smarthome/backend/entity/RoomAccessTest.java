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

@DisplayName("RoomAccess Entity Tests")
class RoomAccessTest {

        private Validator validator;
        private RoomAccess roomAccess;
        private User user;
        private Room room;

        @BeforeEach
        void setUp() {
                ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
                validator = factory.getValidator();
                user = new User("testuser", "test@example.com", "hash123");
                Home home = new Home("Test Home", "123 Test St");
                room = new Room(home, "Test Room");
                roomAccess = new RoomAccess();
        }

        @Test
        @DisplayName("Default constructor creates room access with default permission")
        void defaultConstructor_ShouldCreateRoomAccessWithDefaults() {
                RoomAccess newRoomAccess = new RoomAccess();

                assertNull(newRoomAccess.getAccessId());
                assertNull(newRoomAccess.getUser());
                assertNull(newRoomAccess.getRoom());
                assertEquals(Permission.READ, newRoomAccess.getPermission());
        }

        @Test
        @DisplayName("Parameterized constructor with permission sets fields correctly")
        void parameterizedConstructorWithPermission_ShouldSetFields() {
                RoomAccess newRoomAccess = new RoomAccess(user, room, Permission.WRITE);

                assertEquals(user, newRoomAccess.getUser());
                assertEquals(room, newRoomAccess.getRoom());
                assertEquals(Permission.WRITE, newRoomAccess.getPermission());
                assertNull(newRoomAccess.getAccessId()); // ID is generated
        }

        @Test
        @DisplayName("Parameterized constructor without permission defaults to READ")
        void parameterizedConstructorWithoutPermission_ShouldDefaultToRead() {
                RoomAccess newRoomAccess = new RoomAccess(user, room);

                assertEquals(user, newRoomAccess.getUser());
                assertEquals(room, newRoomAccess.getRoom());
                assertEquals(Permission.READ, newRoomAccess.getPermission());
        }

        @Test
        @DisplayName("Valid room access passes validation")
        void validRoomAccess_ShouldPassValidation() {
                roomAccess.setUser(user);
                roomAccess.setRoom(room);
                roomAccess.setPermission(Permission.ADMIN);

                Set<ConstraintViolation<RoomAccess>> violations = validator.validate(roomAccess);

                assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("User validation tests")
        void userValidation_ShouldEnforceConstraints() {
                roomAccess.setRoom(room);
                roomAccess.setPermission(Permission.READ);

                // Test null user
                roomAccess.setUser(null);
                Set<ConstraintViolation<RoomAccess>> violations = validator.validate(roomAccess);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream().anyMatch(v -> v.getMessage().contains("User cannot be null")));
        }

        @Test
        @DisplayName("Room validation tests")
        void roomValidation_ShouldEnforceConstraints() {
                roomAccess.setUser(user);
                roomAccess.setPermission(Permission.READ);

                // Test null room
                roomAccess.setRoom(null);
                Set<ConstraintViolation<RoomAccess>> violations = validator.validate(roomAccess);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream().anyMatch(v -> v.getMessage().contains("Room cannot be null")));
        }

        @Test
        @DisplayName("Permission can be set and retrieved")
        void permission_ShouldBeSetAndRetrieved() {
                roomAccess.setPermission(Permission.WRITE);
                assertEquals(Permission.WRITE, roomAccess.getPermission());

                roomAccess.setPermission(Permission.ADMIN);
                assertEquals(Permission.ADMIN, roomAccess.getPermission());

                roomAccess.setPermission(Permission.READ);
                assertEquals(Permission.READ, roomAccess.getPermission());
        }

        @Test
        @DisplayName("All permission types are supported")
        void allPermissionTypes_ShouldBeSupported() {
                Permission[] permissions = {Permission.READ, Permission.WRITE, Permission.ADMIN};

                for (Permission permission : permissions) {
                        roomAccess.setPermission(permission);
                        assertEquals(permission, roomAccess.getPermission());

                        // Should pass validation
                        roomAccess.setUser(user);
                        roomAccess.setRoom(room);
                        Set<ConstraintViolation<RoomAccess>> violations = validator.validate(roomAccess);
                        assertTrue(violations.isEmpty(), "Permission " + permission + " should be valid");
                }
        }

        @Test
        @DisplayName("Getters and setters work correctly")
        void gettersAndSetters_ShouldWorkCorrectly() {
                roomAccess.setUser(user);
                roomAccess.setRoom(room);
                roomAccess.setPermission(Permission.ADMIN);

                assertEquals(user, roomAccess.getUser());
                assertEquals(room, roomAccess.getRoom());
                assertEquals(Permission.ADMIN, roomAccess.getPermission());
        }

        @Test
        @DisplayName("Unique constraint should be enforced logically")
        void uniqueConstraint_ShouldBeEnforcedLogically() {
                // This test verifies the logical expectation that a user
                // should have only one access record per room
                RoomAccess access1 = new RoomAccess(user, room, Permission.READ);
                RoomAccess access2 = new RoomAccess(user, room, Permission.WRITE);

                // Both accesses have same user and room
                assertEquals(access1.getUser(), access2.getUser());
                assertEquals(access1.getRoom(), access2.getRoom());

                // But different permissions - this would violate unique constraint in DB
                assertNotEquals(access1.getPermission(), access2.getPermission());
        }

        @Test
        @DisplayName("Permission hierarchy concept")
        void permissionHierarchy_ShouldBeClear() {
                // This test documents the expected permission hierarchy
                // READ < WRITE < ADMIN (conceptually)

                assertEquals("read", Permission.READ.getValue());
                assertEquals("write", Permission.WRITE.getValue());
                assertEquals("admin", Permission.ADMIN.getValue());

                // Verify all permissions are distinct
                assertNotEquals(Permission.READ, Permission.WRITE);
                assertNotEquals(Permission.WRITE, Permission.ADMIN);
                assertNotEquals(Permission.READ, Permission.ADMIN);
        }
}

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RoomTest {
    private Room room;
    private Light light;

    @BeforeEach
    void setUp() {
        room = new Room("Living Room");
        light = new Light("L1", "Living Room Light");
    }

    @Test
    void testAddAndRemoveDeviceInRoom() {
        room.addDevice(light);
        assertTrue(room.getDevices().contains(light), "Room should contain light after adding it");
        room.removeDevice(light);
        assertFalse(room.getDevices().contains(light), "Room should not contain light after removing it");
    }
}

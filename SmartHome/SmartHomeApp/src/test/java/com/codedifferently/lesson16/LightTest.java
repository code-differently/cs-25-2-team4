import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class LightTest {
    private Light light;

    @BeforeEach
    void setUp() {
        light = new Light("L1", "Living Room Light");
    }

    @Test
    void testLightSwitchOnOff() {
        light.switchOn();
        assertTrue(light.isOn(), "Light should be on after switchOn()");
        light.switchOff();
        assertFalse(light.isOn(), "Light should be off after switchOff()");
    }

    @Test
    void testSetAndGetLuminosity() {
        light.setLuminosity(0.75);
        assertEquals(0.75, light.getLuminosity(), 0.01, "Luminosity should match set value");
    }
}
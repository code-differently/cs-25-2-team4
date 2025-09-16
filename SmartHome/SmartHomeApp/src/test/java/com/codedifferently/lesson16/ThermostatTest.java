import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ThermostatTest {
    private Thermostat thermostat;

    @BeforeEach
    void setUp() {
        thermostat = new Thermostat("T1", "Main Thermostat");
    }

    @Test
    void testSetAndGetTemperature() {
        thermostat.setTemp(22.5);
        assertEquals(22.5, thermostat.getTemp(), 0.01, 
            "Temperature should match the value set");
    }

    @Test
    void testThermostatSwitchOnOff() {
        thermostat.switchOn();
        assertTrue(thermostat.isOn(), 
            "Thermostat should be on after switchOn()");
        thermostat.switchOff();
        assertFalse(thermostat.isOn(), 
            "Thermostat should be off after switchOff()");
    }
}

package com.smarthome.backend.repository;

import com.smarthome.backend.entity.*;
import com.smarthome.backend.enums.DeviceStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class DeviceRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private DeviceRepository deviceRepository;

    private Home testHome;
    private Room livingRoom;
    private Room kitchen;
    private Light livingRoomLight;
    private Thermostat kitchenThermostat;
    private SecurityCamera livingRoomCamera;

    @BeforeEach
    void setUp() {
        // Create test home
        testHome = new Home("Test Home", "123 Test St");
        testHome = entityManager.persistAndFlush(testHome);

        // Create test rooms
        livingRoom = new Room(testHome, "Living Room");
        livingRoom = entityManager.persistAndFlush(livingRoom);

        kitchen = new Room(testHome, "Kitchen");
        kitchen = entityManager.persistAndFlush(kitchen);

        // Create test devices
        livingRoomLight = new Light("Living Room Light", livingRoom);
        livingRoomLight.setBrightness(75);
        livingRoomLight.setColorHex("#FFFFFF");
        livingRoomLight = entityManager.persistAndFlush(livingRoomLight);

        kitchenThermostat = new Thermostat("Kitchen Thermostat", kitchen);
        kitchenThermostat.setTargetTemp(72.0);
        kitchenThermostat = entityManager.persistAndFlush(kitchenThermostat);

        livingRoomCamera = new SecurityCamera("Living Room Camera", livingRoom);
        livingRoomCamera.setStreamUrl("http://test.stream");
        livingRoomCamera.setResolution("1080p");
        livingRoomCamera = entityManager.persistAndFlush(livingRoomCamera);

        entityManager.clear();
    }

    @Test
    void findByRoom_RoomId_ReturnsDevicesInRoom() {
        List<Device> livingRoomDevices = deviceRepository.findByRoom_RoomId(livingRoom.getRoomId());

        assertEquals(2, livingRoomDevices.size());
        assertTrue(livingRoomDevices.stream().anyMatch(d -> d.getDeviceName().equals("Living Room Light")));
        assertTrue(livingRoomDevices.stream().anyMatch(d -> d.getDeviceName().equals("Living Room Camera")));
    }

    @Test
    void findByRoom_RoomId_EmptyRoom_ReturnsEmptyList() {
        Room emptyRoom = new Room();
        emptyRoom.setName("Empty Room");
        emptyRoom.setHome(testHome);
        emptyRoom = entityManager.persistAndFlush(emptyRoom);

        List<Device> devices = deviceRepository.findByRoom_RoomId(emptyRoom.getRoomId());

        assertTrue(devices.isEmpty());
    }

    @Test
    void findByDeviceNameContainingIgnoreCase_PartialMatch_ReturnsMatchingDevices() {
        List<Device> devices = deviceRepository.findByDeviceNameContainingIgnoreCase("light");

        assertEquals(1, devices.size());
        assertEquals("Living Room Light", devices.get(0).getDeviceName());
    }

    @Test
    void findByDeviceNameContainingIgnoreCase_CaseInsensitive_ReturnsMatchingDevices() {
        List<Device> devices = deviceRepository.findByDeviceNameContainingIgnoreCase("THERMOSTAT");

        assertEquals(1, devices.size());
        assertEquals("Kitchen Thermostat", devices.get(0).getDeviceName());
    }

    @Test
    void findByDeviceNameContainingIgnoreCase_NoMatch_ReturnsEmptyList() {
        List<Device> devices = deviceRepository.findByDeviceNameContainingIgnoreCase("nonexistent");

        assertTrue(devices.isEmpty());
    }

    @Test
    void findByStatus_OnDevices_ReturnsDevicesWithOnStatus() {
        // Turn on some devices
        livingRoomLight.setStatus(DeviceStatus.ON);
        kitchenThermostat.setStatus(DeviceStatus.ON);
        livingRoomCamera.setStatus(DeviceStatus.OFF);
        
        entityManager.merge(livingRoomLight);
        entityManager.merge(kitchenThermostat);
        entityManager.merge(livingRoomCamera);
        entityManager.flush();

        List<Device> onDevices = deviceRepository.findByStatus(DeviceStatus.ON);

        assertEquals(2, onDevices.size());
        assertTrue(onDevices.stream().allMatch(d -> d.getStatus() == DeviceStatus.ON));
    }

    @Test
    void findByDeviceType_LightType_ReturnsOnlyLights() {
        List<Device> lights = deviceRepository.findByDeviceType(Light.class);

        assertEquals(1, lights.size());
        assertTrue(lights.get(0) instanceof Light);
        assertEquals("Living Room Light", lights.get(0).getDeviceName());
    }

    @Test
    void findByHomeId_ValidHomeId_ReturnsAllDevicesInHome() {
        List<Device> homeDevices = deviceRepository.findByHomeId(testHome.getHomeId());

        assertEquals(3, homeDevices.size());
        assertTrue(homeDevices.stream().anyMatch(d -> d.getDeviceName().equals("Living Room Light")));
        assertTrue(homeDevices.stream().anyMatch(d -> d.getDeviceName().equals("Kitchen Thermostat")));
        assertTrue(homeDevices.stream().anyMatch(d -> d.getDeviceName().equals("Living Room Camera")));
    }

    @Test
    void findByHomeId_NonExistentHomeId_ReturnsEmptyList() {
        List<Device> devices = deviceRepository.findByHomeId(999L);

        assertTrue(devices.isEmpty());
    }

    @Test
    void countByRoom_RoomId_ReturnsCorrectCount() {
        long count = deviceRepository.countByRoom_RoomId(livingRoom.getRoomId());

        assertEquals(2, count);
    }

    @Test
    void countByRoom_RoomId_EmptyRoom_ReturnsZero() {
        Room emptyRoom = new Room();
        emptyRoom.setName("Empty Room");
        emptyRoom.setHome(testHome);
        emptyRoom = entityManager.persistAndFlush(emptyRoom);

        long count = deviceRepository.countByRoom_RoomId(emptyRoom.getRoomId());

        assertEquals(0, count);
    }

    @Test
    void existsByDeviceNameAndRoom_RoomId_ExistingDevice_ReturnsTrue() {
        boolean exists = deviceRepository.existsByDeviceNameAndRoom_RoomId(
            "Living Room Light", livingRoom.getRoomId());

        assertTrue(exists);
    }

    @Test
    void existsByDeviceNameAndRoom_RoomId_NonExistingDevice_ReturnsFalse() {
        boolean exists = deviceRepository.existsByDeviceNameAndRoom_RoomId(
            "Non-existent Device", livingRoom.getRoomId());

        assertFalse(exists);
    }

    @Test
    void existsByDeviceNameAndRoom_RoomId_DifferentRoom_ReturnsFalse() {
        boolean exists = deviceRepository.existsByDeviceNameAndRoom_RoomId(
            "Kitchen Thermostat", livingRoom.getRoomId());

        assertFalse(exists);
    }

    @Test
    void save_NewDevice_PersistsDevice() {
        Room newRoom = new Room(testHome, "Bedroom");
        newRoom = entityManager.persistAndFlush(newRoom);

        Light newLight = new Light("Bedroom Light", newRoom);
        newLight.setBrightness(50);
        newLight.setColorHex("#FF0000");

        Device savedDevice = deviceRepository.save(newLight);

        assertNotNull(savedDevice.getDeviceId());
        assertEquals("Bedroom Light", savedDevice.getDeviceName());
        assertTrue(savedDevice instanceof Light);
    }

    @Test
    void deleteById_ExistingDevice_RemovesDevice() {
        Long deviceId = livingRoomLight.getDeviceId();
        assertTrue(deviceRepository.existsById(deviceId));

        deviceRepository.deleteById(deviceId);

        assertFalse(deviceRepository.existsById(deviceId));
    }
}
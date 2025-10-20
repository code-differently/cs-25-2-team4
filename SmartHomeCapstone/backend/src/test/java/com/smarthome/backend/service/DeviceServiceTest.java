package com.smarthome.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.smarthome.backend.dto.DeviceCreateRequest;
import com.smarthome.backend.entity.*;
import com.smarthome.backend.repository.DeviceRepository;
import com.smarthome.backend.repository.RoomRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DeviceServiceTest {

        @Mock private DeviceRepository deviceRepository;

        @Mock private RoomRepository roomRepository;

        @InjectMocks private DeviceService deviceService;

        private Room testRoom;
        private Home testHome;
        private Light testLight;
        private Thermostat testThermostat;
        private SecurityCamera testCamera;
        private DeviceCreateRequest lightCreateRequest;
        private DeviceCreateRequest thermostatCreateRequest;
        private DeviceCreateRequest cameraCreateRequest;

        @BeforeEach
        void setUp() {
                testHome = new Home("Test Home", "123 Test St");

                testRoom = new Room(testHome, "Living Room");

                testLight = new Light("Test Light", testRoom);

                testThermostat = new Thermostat("Test Thermostat", testRoom);

                testCamera = new SecurityCamera("Test Camera", testRoom);

                lightCreateRequest = new DeviceCreateRequest();
                lightCreateRequest.setDeviceName("Test Light");
                lightCreateRequest.setRoomId(1L);
                lightCreateRequest.setDeviceType("LIGHT");
                lightCreateRequest.setBrightness(75);
                lightCreateRequest.setColorHex("#FFFFFF");

                thermostatCreateRequest = new DeviceCreateRequest();
                thermostatCreateRequest.setDeviceName("Test Thermostat");
                thermostatCreateRequest.setRoomId(1L);
                thermostatCreateRequest.setDeviceType("THERMOSTAT");
                thermostatCreateRequest.setTemperature(72.0);

                cameraCreateRequest = new DeviceCreateRequest();
                cameraCreateRequest.setDeviceName("Test Camera");
                cameraCreateRequest.setRoomId(1L);
                cameraCreateRequest.setDeviceType("CAMERA");
                cameraCreateRequest.setStreamUrl("http://test.stream");
                cameraCreateRequest.setResolution("1080p");
        }

        @Test
        void createDevice_ValidLightRequest_ReturnsLight() {
                when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
                when(deviceRepository.existsByDeviceNameAndRoom_RoomId("Test Light", 1L)).thenReturn(false);
                when(deviceRepository.save(any(Light.class))).thenReturn(testLight);

                Device result = deviceService.createDevice(lightCreateRequest);

                assertNotNull(result);
                assertTrue(result instanceof Light);
                assertEquals("Test Light", result.getDeviceName());
                verify(deviceRepository).save(any(Light.class));
        }

        @Test
        void createDevice_ValidThermostatRequest_ReturnsThermostat() {
                when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
                when(deviceRepository.existsByDeviceNameAndRoom_RoomId("Test Thermostat", 1L))
                                .thenReturn(false);
                when(deviceRepository.save(any(Thermostat.class))).thenReturn(testThermostat);

                Device result = deviceService.createDevice(thermostatCreateRequest);

                assertNotNull(result);
                assertTrue(result instanceof Thermostat);
                assertEquals("Test Thermostat", result.getDeviceName());
                verify(deviceRepository).save(any(Thermostat.class));
        }

        @Test
        void createDevice_ValidCameraRequest_ReturnsCamera() {
                when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
                when(deviceRepository.existsByDeviceNameAndRoom_RoomId("Test Camera", 1L))
                                .thenReturn(false);
                when(deviceRepository.save(any(SecurityCamera.class))).thenReturn(testCamera);

                Device result = deviceService.createDevice(cameraCreateRequest);

                assertNotNull(result);
                assertTrue(result instanceof SecurityCamera);
                assertEquals("Test Camera", result.getDeviceName());
                verify(deviceRepository).save(any(SecurityCamera.class));
        }

        @Test
        void createDevice_RoomNotFound_ThrowsException() {
                when(roomRepository.findById(1L)).thenReturn(Optional.empty());

                RuntimeException exception =
                                assertThrows(
                                                RuntimeException.class,
                                                () -> deviceService.createDevice(lightCreateRequest));

                assertEquals("Room not found with ID: 1", exception.getMessage());
                verify(deviceRepository, never()).save(any());
        }

        @Test
        void createDevice_DuplicateDeviceName_ThrowsException() {
                when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
                when(deviceRepository.existsByDeviceNameAndRoom_RoomId("Test Light", 1L)).thenReturn(true);

                RuntimeException exception =
                                assertThrows(
                                                RuntimeException.class,
                                                () -> deviceService.createDevice(lightCreateRequest));

                assertEquals(
                                "Device with name 'Test Light' already exists in this room",
                                exception.getMessage());
                verify(deviceRepository, never()).save(any());
        }

        @Test
        void createDevice_UnsupportedDeviceType_ThrowsException() {
                DeviceCreateRequest invalidRequest = new DeviceCreateRequest();
                invalidRequest.setDeviceName("Test Device");
                invalidRequest.setRoomId(1L);
                invalidRequest.setDeviceType("INVALID_TYPE");

                when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
                when(deviceRepository.existsByDeviceNameAndRoom_RoomId("Test Device", 1L))
                                .thenReturn(false);

                RuntimeException exception =
                                assertThrows(
                                                RuntimeException.class, () -> deviceService.createDevice(invalidRequest));

                assertEquals("Unsupported device type: INVALID_TYPE", exception.getMessage());
                verify(deviceRepository, never()).save(any());
        }

        @Test
        void getDeviceById_ExistingDevice_ReturnsDevice() {
                when(deviceRepository.findById(1L)).thenReturn(Optional.of(testLight));

                Optional<Device> result = deviceService.getDeviceById(1L);

                assertTrue(result.isPresent());
                assertEquals(testLight, result.get());
        }

        @Test
        void getDeviceById_NonExistingDevice_ReturnsEmpty() {
                when(deviceRepository.findById(1L)).thenReturn(Optional.empty());

                Optional<Device> result = deviceService.getDeviceById(1L);

                assertFalse(result.isPresent());
        }

        @Test
        void getDevicesByRoom_ValidRoomId_ReturnsDeviceList() {
                List<Device> devices = Arrays.asList(testLight, testThermostat);
                when(deviceRepository.findByRoom_RoomId(1L)).thenReturn(devices);

                List<Device> result = deviceService.getDevicesByRoom(1L);

                assertEquals(2, result.size());
                assertTrue(result.contains(testLight));
                assertTrue(result.contains(testThermostat));
        }

        @Test
        void getDevicesByHome_ValidHomeId_ReturnsDeviceList() {
                List<Device> devices = Arrays.asList(testLight, testThermostat, testCamera);
                when(deviceRepository.findByHomeId(1L)).thenReturn(devices);

                List<Device> result = deviceService.getDevicesByHome(1L);

                assertEquals(3, result.size());
                assertTrue(result.contains(testLight));
                assertTrue(result.contains(testThermostat));
                assertTrue(result.contains(testCamera));
        }

        @Test
        void searchDevicesByName_ValidSearchTerm_ReturnsMatchingDevices() {
                List<Device> devices = Arrays.asList(testLight);
                when(deviceRepository.findByDeviceNameContainingIgnoreCase("light")).thenReturn(devices);

                List<Device> result = deviceService.searchDevicesByName("light");

                assertEquals(1, result.size());
                assertTrue(result.contains(testLight));
        }

        @Test
        void controlDevice_ValidAction_ReturnsUpdatedDevice() {
                when(deviceRepository.findById(1L)).thenReturn(Optional.of(testLight));
                when(deviceRepository.save(testLight)).thenReturn(testLight);

                Device result = deviceService.controlDevice(1L, "turn_on", true);

                assertNotNull(result);
                verify(deviceRepository).save(testLight);
        }

        @Test
        void controlDevice_DeviceNotFound_ThrowsException() {
                when(deviceRepository.findById(1L)).thenReturn(Optional.empty());

                RuntimeException exception =
                                assertThrows(
                                                RuntimeException.class,
                                                () -> deviceService.controlDevice(1L, "turn_on", true));

                assertEquals("Device not found with ID: 1", exception.getMessage());
                verify(deviceRepository, never()).save(any());
        }

        @Test
        void deleteDevice_ExistingDevice_DeletesDevice() {
                when(deviceRepository.existsById(1L)).thenReturn(true);
                doNothing().when(deviceRepository).deleteById(1L);

                assertDoesNotThrow(() -> deviceService.deleteDevice(1L));

                verify(deviceRepository).deleteById(1L);
        }

        @Test
        void deleteDevice_NonExistingDevice_ThrowsException() {
                when(deviceRepository.existsById(1L)).thenReturn(false);

                RuntimeException exception =
                                assertThrows(RuntimeException.class, () -> deviceService.deleteDevice(1L));

                assertEquals("Device not found with ID: 1", exception.getMessage());
                verify(deviceRepository, never()).deleteById(1L);
        }
}

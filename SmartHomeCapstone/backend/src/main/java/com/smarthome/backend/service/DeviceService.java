package com.smarthome.backend.service;

import com.smarthome.backend.dto.DeviceCreateRequest;
import com.smarthome.backend.entity.*;
import com.smarthome.backend.repository.DeviceRepository;
import com.smarthome.backend.repository.RoomRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DeviceService {

        private final DeviceRepository deviceRepository;
        private final RoomRepository roomRepository;

        @Autowired
        public DeviceService(DeviceRepository deviceRepository, RoomRepository roomRepository) {
                this.deviceRepository = deviceRepository;
                this.roomRepository = roomRepository;
        }

        /** Create a new device in the database */
        public Device createDevice(DeviceCreateRequest request) {
                // Check if room exists
                Room room =
                                roomRepository
                                                .findById(request.getRoomId())
                                                .orElseThrow(
                                                                () ->
                                                                                new RuntimeException(
                                                                                                "Room not found with ID: " + request.getRoomId()));

                // Check if device name already exists in this room
                if (deviceRepository.existsByDeviceNameAndRoom_RoomId(
                                request.getDeviceName(), request.getRoomId())) {
                        throw new RuntimeException(
                                        "Device with name '"
                                                        + request.getDeviceName()
                                                        + "' already exists in this room");
                }

                // Create device based on type using the request data and the room.
                Device device = createDeviceByType(request, room);

                // Save and return the device
                return deviceRepository.save(device);
        }

        /** Get device by ID */
        @Transactional(readOnly = true)
        public Optional<Device> getDeviceById(Long deviceId) {
                return deviceRepository.findById(deviceId);
        }

        /** Get all devices in a room */
        @Transactional(readOnly = true)
        public List<Device> getDevicesByRoom(Long roomId) {
                return deviceRepository.findByRoom_RoomId(roomId);
        }

        /** Control a device (turn on/off, set properties) */
        public Device controlDevice(Long deviceId, String action, Object value) {
                // Check if device exists
                Device device =
                                deviceRepository
                                                .findById(deviceId)
                                                .orElseThrow(
                                                                () ->
                                                                                new RuntimeException(
                                                                                                "Device not found with ID: " + deviceId));

                // Handle basic on/off actions using Device class methods
                try {
                        switch (action.toLowerCase()) {
                                case "turn_on":
                                        device.turnOn();
                                        break;
                                case "turn_off":
                                        device.turnOff();
                                        break;
                                default:
                                        // Use performAction for device-specific actions
                                        device.performAction(action, value);
                                        break;
                        }
                } catch (IllegalArgumentException e) {
                        throw new RuntimeException(
                                        "Invalid action '"
                                                        + action
                                                        + "' for device type: "
                                                        + device.getClass().getSimpleName());
                }

                // Save and return updated device
                return deviceRepository.save(device);
        }

        /** Delete a device */
        public void deleteDevice(Long deviceId) {
                // Check if device exists
                if (!deviceRepository.existsById(deviceId)) {
                        throw new RuntimeException("Device not found with ID: " + deviceId);
                }

                deviceRepository.deleteById(deviceId);
        }

        /** Get all devices in a home */
        @Transactional(readOnly = true)
        public List<Device> getDevicesByHome(Long homeId) {
                return deviceRepository.findByHomeId(homeId);
        }

        /** Search devices by name */
        @Transactional(readOnly = true)
        public List<Device> searchDevicesByName(String deviceName) {
                return deviceRepository.findByDeviceNameContainingIgnoreCase(deviceName);
        }

        /** Helper method to create device based on type */
        private Device createDeviceByType(DeviceCreateRequest request, Room room) {
                switch (request.getDeviceType().toUpperCase()) {
                        case "LIGHT":
                                Light light = new Light(request.getDeviceName(), room);
                                if (request.getBrightness() != null) {
                                        light.setBrightness(request.getBrightness());
                                }
                                if (request.getColorHex() != null) {
                                        light.setColorHex(request.getColorHex());
                                }
                                return light;

                        case "THERMOSTAT":
                                Thermostat thermostat = new Thermostat(request.getDeviceName(), room);
                                if (request.getTemperature() != null) {
                                        thermostat.setTargetTemp(request.getTemperature());
                                }
                                return thermostat;

                        case "CAMERA":
                                SecurityCamera camera = new SecurityCamera(request.getDeviceName(), room);
                                if (request.getStreamUrl() != null) {
                                        camera.setStreamUrl(request.getStreamUrl());
                                }
                                if (request.getResolution() != null) {
                                        camera.setResolution(request.getResolution());
                                }
                                return camera;

                        default:
                                throw new RuntimeException("Unsupported device type: " + request.getDeviceType());
                }
        }
}

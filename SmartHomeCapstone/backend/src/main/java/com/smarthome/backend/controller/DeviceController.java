package com.smarthome.backend.controller;

import com.smarthome.backend.dto.DeviceCreateRequest;
import com.smarthome.backend.dto.DeviceControlRequest;
import com.smarthome.backend.dto.DeviceResponse;
import com.smarthome.backend.entity.Device;
import com.smarthome.backend.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*") // Allow frontend to access the API
public class DeviceController {

    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    /**
     * Create a new device
     * POST /api/devices
     */
    @PostMapping
    public ResponseEntity<DeviceResponse> createDevice(@Valid @RequestBody DeviceCreateRequest request) {
        try {
            Device device = deviceService.createDevice(request);
            DeviceResponse response = new DeviceResponse(device);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get device by ID
     * GET /api/devices/{id}
     */
    @GetMapping("/{deviceId}")
    public ResponseEntity<DeviceResponse> getDevice(@PathVariable Long deviceId) {
        Optional<Device> device = deviceService.getDeviceById(deviceId);
        
        if (device.isPresent()) {
            DeviceResponse response = new DeviceResponse(device.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all devices in a room, or a home if roomId is not provided
     * GET /api/devices?roomId={roomId}
     */
    @GetMapping
    public ResponseEntity<List<DeviceResponse>> getDevices(@RequestParam(required = false) Long roomId,
                                                           @RequestParam(required = false) Long homeId,
                                                           @RequestParam(required = false) String search) {
        List<Device> devices;
        
        if (roomId != null) {
            devices = deviceService.getDevicesByRoom(roomId);
        } else if (homeId != null) {
            devices = deviceService.getDevicesByHome(homeId);
        } else if (search != null && !search.trim().isEmpty()) {
            devices = deviceService.searchDevicesByName(search);
        } else {
            return ResponseEntity.badRequest().build(); // Must provide at least one filter
        }

        List<DeviceResponse> response = devices.stream()
                .map(DeviceResponse::new)
                .toList();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Control a device (turn on/off, set properties)
     * PUT /api/devices/{id}/control
     */
    @PutMapping("/{deviceId}/control")
    public ResponseEntity<DeviceResponse> controlDevice(@PathVariable Long deviceId,
                                                        @Valid @RequestBody DeviceControlRequest request) {
        try {
            Device device = deviceService.controlDevice(deviceId, request.getAction(), request.getValue());
            DeviceResponse response = new DeviceResponse(device);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update device properties
     * PUT /api/devices/{id}
     */
    @PutMapping("/{deviceId}")
    public ResponseEntity<DeviceResponse> updateDevice(@PathVariable Long deviceId,
                                                       @Valid @RequestBody DeviceCreateRequest request) {
        // For simplicity, we'll use the control functionality
        // In a real app, you might have separate update logic
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /**
     * Delete a device
     * DELETE /api/devices/{id}
     */
    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long deviceId) {
        try {
            deviceService.deleteDevice(deviceId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Turn device on
     * POST /api/devices/{id}/on
     */
    @PostMapping("/{deviceId}/on")
    public ResponseEntity<DeviceResponse> turnDeviceOn(@PathVariable Long deviceId) {
        try {
            Device device = deviceService.controlDevice(deviceId, "turn_on", true);
            DeviceResponse response = new DeviceResponse(device);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Turn device off
     * POST /api/devices/{id}/off
     */
    @PostMapping("/{deviceId}/off")
    public ResponseEntity<DeviceResponse> turnDeviceOff(@PathVariable Long deviceId) {
        try {
            Device device = deviceService.controlDevice(deviceId, "turn_off", false);
            DeviceResponse response = new DeviceResponse(device);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
package com.smarthome.backend.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarthome.backend.dto.DeviceControlRequest;
import com.smarthome.backend.dto.DeviceCreateRequest;
import com.smarthome.backend.entity.Device;
import com.smarthome.backend.entity.Home;
import com.smarthome.backend.entity.Light;
import com.smarthome.backend.entity.Room;
import com.smarthome.backend.service.DeviceService;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(DeviceController.class)
class DeviceControllerTest {

        @Autowired private MockMvc mockMvc;

        @MockBean private DeviceService deviceService;

        @Autowired private ObjectMapper objectMapper;

        private Device testDevice;
        private Room testRoom;
        private DeviceCreateRequest deviceCreateRequest;
        private DeviceControlRequest deviceControlRequest;

        @BeforeEach
        void setUp() {
                Home testHome = new Home("Test Home", "123 Test St");
                testRoom = new Room(testHome, "Living Room");

                testDevice = new Light("Test Light", testRoom);

                deviceCreateRequest = new DeviceCreateRequest();
                deviceCreateRequest.setDeviceName("Test Light");
                deviceCreateRequest.setRoomId(1L);
                deviceCreateRequest.setDeviceType("LIGHT");
                deviceCreateRequest.setBrightness(75);
                deviceCreateRequest.setColorHex("#FFFFFF");

                deviceControlRequest = new DeviceControlRequest();
                deviceControlRequest.setAction("turn_on");
                deviceControlRequest.setValue(true);
        }

        @Test
        void createDevice_ValidRequest_Returns201Created() throws Exception {
                when(deviceService.createDevice(any(DeviceCreateRequest.class))).thenReturn(testDevice);

                mockMvc.perform(
                                                post("/api/devices")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(objectMapper.writeValueAsString(deviceCreateRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.deviceName").value("Test Light"))
                                .andExpect(jsonPath("$.deviceType").value("LIGHT"));
        }

        @Test
        void createDevice_InvalidRequest_Returns400BadRequest() throws Exception {
                when(deviceService.createDevice(any(DeviceCreateRequest.class)))
                                .thenThrow(new RuntimeException("Room not found"));

                mockMvc.perform(
                                                post("/api/devices")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(objectMapper.writeValueAsString(deviceCreateRequest)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void createDevice_MissingRequiredFields_Returns400BadRequest() throws Exception {
                DeviceCreateRequest invalidRequest = new DeviceCreateRequest();
                // Missing required fields

                mockMvc.perform(
                                                post("/api/devices")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(objectMapper.writeValueAsString(invalidRequest)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void getDevice_ExistingDevice_ReturnsDevice() throws Exception {
                when(deviceService.getDeviceById(1L)).thenReturn(Optional.of(testDevice));

                mockMvc.perform(get("/api/devices/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.deviceName").value("Test Light"));
        }

        @Test
        void getDevice_NonExistingDevice_Returns404NotFound() throws Exception {
                when(deviceService.getDeviceById(1L)).thenReturn(Optional.empty());

                mockMvc.perform(get("/api/devices/1")).andExpect(status().isNotFound());
        }

        @Test
        void getDevices_WithRoomId_ReturnsDeviceList() throws Exception {
                List<Device> devices = Arrays.asList(testDevice);
                when(deviceService.getDevicesByRoom(1L)).thenReturn(devices);

                mockMvc.perform(get("/api/devices").param("roomId", "1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$[0].deviceName").value("Test Light"));
        }

        @Test
        void getDevices_WithHomeId_ReturnsDeviceList() throws Exception {
                List<Device> devices = Arrays.asList(testDevice);
                when(deviceService.getDevicesByHome(1L)).thenReturn(devices);

                mockMvc.perform(get("/api/devices").param("homeId", "1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$[0].deviceName").value("Test Light"));
        }

        @Test
        void getDevices_WithSearch_ReturnsDeviceList() throws Exception {
                List<Device> devices = Arrays.asList(testDevice);
                when(deviceService.searchDevicesByName("light")).thenReturn(devices);

                mockMvc.perform(get("/api/devices").param("search", "light"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$[0].deviceName").value("Test Light"));
        }

        @Test
        void getDevices_NoParameters_Returns400BadRequest() throws Exception {
                mockMvc.perform(get("/api/devices")).andExpect(status().isBadRequest());
        }

        @Test
        void getDevices_EmptySearch_Returns400BadRequest() throws Exception {
                mockMvc.perform(get("/api/devices").param("search", "")).andExpect(status().isBadRequest());
        }

        @Test
        void controlDevice_ValidRequest_ReturnsUpdatedDevice() throws Exception {
                when(deviceService.controlDevice(eq(1L), eq("turn_on"), eq(true))).thenReturn(testDevice);

                mockMvc.perform(
                                                put("/api/devices/1/control")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(objectMapper.writeValueAsString(deviceControlRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.deviceName").value("Test Light"));
        }

        @Test
        void controlDevice_InvalidAction_Returns400BadRequest() throws Exception {
                when(deviceService.controlDevice(eq(1L), eq("turn_on"), eq(true)))
                                .thenThrow(new RuntimeException("Invalid action"));

                mockMvc.perform(
                                                put("/api/devices/1/control")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(objectMapper.writeValueAsString(deviceControlRequest)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void deleteDevice_ExistingDevice_Returns204NoContent() throws Exception {
                doNothing().when(deviceService).deleteDevice(1L);

                mockMvc.perform(delete("/api/devices/1")).andExpect(status().isNoContent());
        }

        @Test
        void deleteDevice_NonExistingDevice_Returns404NotFound() throws Exception {
                doThrow(new RuntimeException("Device not found")).when(deviceService).deleteDevice(1L);

                mockMvc.perform(delete("/api/devices/1")).andExpect(status().isNotFound());
        }

        @Test
        void turnDeviceOn_ValidDevice_ReturnsUpdatedDevice() throws Exception {
                when(deviceService.controlDevice(eq(1L), eq("turn_on"), eq(true))).thenReturn(testDevice);

                mockMvc.perform(post("/api/devices/1/on"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.deviceName").value("Test Light"));
        }

        @Test
        void turnDeviceOff_ValidDevice_ReturnsUpdatedDevice() throws Exception {
                when(deviceService.controlDevice(eq(1L), eq("turn_off"), eq(false))).thenReturn(testDevice);

                mockMvc.perform(post("/api/devices/1/off"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.deviceName").value("Test Light"));
        }

        @Test
        void updateDevice_ReturnsNotImplemented() throws Exception {
                mockMvc.perform(
                                                put("/api/devices/1")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(objectMapper.writeValueAsString(deviceCreateRequest)))
                                .andExpect(status().isNotImplemented());
        }
}

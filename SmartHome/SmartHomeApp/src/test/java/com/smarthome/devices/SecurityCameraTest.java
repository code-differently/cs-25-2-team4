package com.smarthome.devices;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SecurityCameraTest {
  private SecurityCamera camera;

  @BeforeEach
  void setUp() {
    camera = new SecurityCamera("C1", "Front Door Camera");
  }

  @Test
  void testCameraRecording() {
    camera.startRecording();
    assertTrue(camera.isRecording(), "Camera should be recording after startRecording()");
    camera.stopRecording();
    assertFalse(camera.isRecording(), "Camera should not be recording after stopRecording()");
  }

  @Test
  void testCameraStatus() {
    String status = camera.getStatus();
    assertTrue(status.contains("Camera ID: C1"), "Status should contain camera ID");
    assertTrue(status.contains("Name: Front Door Camera"), "Status should contain camera name");
    assertTrue(status.contains("Recording: No"), "Status should show not recording initially");
  }


  @Test
  void testDeviceProperties() {
    assertEquals("C1", camera.getDeviceId(), "Device ID should match");
    assertEquals("Front Door Camera", camera.getDeviceName(), "Device name should match");
    assertFalse(camera.isLinked(), "Device should not be linked initially");
  }
}

package com.smarthome.scene;

import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** Unit tests for ConsoleNotificationService */
public class ConsoleNotificationServiceTest {

  @Test
  @DisplayName("Should send alert to console with proper formatting")
  void testSendAlert() {
    ConsoleNotificationService service = new ConsoleNotificationService();

    // Capture console output
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    PrintStream originalOut = System.out;
    System.setOut(new PrintStream(outputStream));

    try {
      service.sendAlert("Test notification message");

      String output = outputStream.toString();
      assertTrue(output.contains("🔔 Notification: Test notification message"));
    } finally {
      System.setOut(originalOut);
    }
  }

  @Test
  @DisplayName("Should handle empty message")
  void testSendEmptyAlert() {
    ConsoleNotificationService service = new ConsoleNotificationService();

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    PrintStream originalOut = System.out;
    System.setOut(new PrintStream(outputStream));

    try {
      service.sendAlert("");

      String output = outputStream.toString();
      assertTrue(output.contains("🔔 Notification: "));
    } finally {
      System.setOut(originalOut);
    }
  }

  @Test
  @DisplayName("Should handle null message gracefully")
  void testSendNullAlert() {
    ConsoleNotificationService service = new ConsoleNotificationService();

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    PrintStream originalOut = System.out;
    System.setOut(new PrintStream(outputStream));

    try {
      service.sendAlert(null);

      String output = outputStream.toString();
      assertTrue(output.contains("🔔 Notification: null"));
    } finally {
      System.setOut(originalOut);
    }
  }

  @Test
  @DisplayName("Should implement NotificationService interface")
  void testImplementsInterface() {
    ConsoleNotificationService service = new ConsoleNotificationService();
    assertTrue(service instanceof NotificationService);
  }
}

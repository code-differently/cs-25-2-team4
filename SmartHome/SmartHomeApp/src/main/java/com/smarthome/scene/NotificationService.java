package com.smarthome.scene;

/** Abstraction for sending notifications (console, email, etc.) */
public interface NotificationService {
  void sendAlert(String message);
}
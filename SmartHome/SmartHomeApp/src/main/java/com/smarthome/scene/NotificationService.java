package com.smarthome.devices;

/**
 * Abstraction for sending notifications (console, email, etc.)
 */
public interface NotificationService {
    void sendAlert(String message);
}
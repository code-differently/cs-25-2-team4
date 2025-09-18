package com.smarthome.devices;

/**
 * A simple implementation that prints notifications to the console.
 */
public class ConsoleNotificationService implements NotificationService {
    @Override
    public void sendAlert(String message) {
        System.out.println("🔔 Notification: " + message);
    }
}

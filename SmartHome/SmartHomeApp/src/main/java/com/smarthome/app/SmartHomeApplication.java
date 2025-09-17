package com.smarthome.app;

import com.smarthome.devices.Light;

public class SmartHomeApplication {
  public static void main(String[] args) {
    System.out.println("Smart Home Application Starting...");

    // Create a simple demo
    HomeManager homeManager = new HomeManager("user123");
    Room livingRoom = new Room("Living Room");
    homeManager.addRoom(livingRoom);

    Light light1 = new Light("light001", "Main Light", "Living Room");
    homeManager.addDevice(light1, livingRoom);

    light1.turnOn();
    light1.setBrightness(75);

    System.out.println(light1.getStatus());
    System.out.println("Smart Home Application Demo Complete!");
  }
}

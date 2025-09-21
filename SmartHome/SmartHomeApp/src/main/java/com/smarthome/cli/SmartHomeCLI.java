package com.smarthome.cli;

import com.smarthome.app.HomeManager;
import com.smarthome.app.Room;
import com.smarthome.devices.Light;
import com.smarthome.devices.SecurityCamera;
import com.smarthome.scene.Action;
import com.smarthome.scene.ConsoleNotificationService;
import com.smarthome.scene.RuleEngine;
import com.smarthome.scene.Scene;
import com.smarthome.scene.SceneManager;
import java.util.Scanner;

public class SmartHomeCLI {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);

    HomeManager homeManager = new HomeManager("Account123");
    SceneManager sceneManager = new SceneManager(homeManager);
    RuleEngine ruleEngine = new RuleEngine(sceneManager, new ConsoleNotificationService());

    // Set up initial rooms, devices, and scenes
    setupInitialData(homeManager, sceneManager);

    // Pass all dependencies to HomePrompter
    HomePrompter prompter = new HomePrompter(scanner, homeManager, sceneManager, ruleEngine);
    
    System.out.println("🏠 Welcome to Smart Home Control System!");
    System.out.println("📋 Pre-configured with Living Room and Kitchen setup");
    System.out.println("💡 Try option 2 to see rooms, or 7 to see available scenes\n");
    
    prompter.startMenuLoop();
    scanner.close();
  }

  private static void setupInitialData(HomeManager homeManager, SceneManager sceneManager) {
    try {
      // Create rooms
      Room livingRoom = new Room("Living Room");
      Room kitchen = new Room("Kitchen");
      
      homeManager.addRoom(livingRoom);
      homeManager.addRoom(kitchen);

      // Create devices for Living Room
      Light livingRoomMainLight = new Light("LR_LIGHT_01", "Living Room Main Light");
      Light livingRoomLampLight = new Light("LR_LAMP_01", "Living Room Lamp");
      
      homeManager.addDevice(livingRoomMainLight, livingRoom);
      homeManager.addDevice(livingRoomLampLight, livingRoom);

      // Create devices for Kitchen  
      Light kitchenMainLight = new Light("KT_LIGHT_01", "Kitchen Main Light");
      Light kitchenIslandLight = new Light("KT_LIGHT_02", "Kitchen Island Light");
      SecurityCamera kitchenCamera = new SecurityCamera("KT_CAM_01", "Kitchen Security Camera");
      
      homeManager.addDevice(kitchenMainLight, kitchen);
      homeManager.addDevice(kitchenIslandLight, kitchen);
      homeManager.addDevice(kitchenCamera, kitchen);

      // Create scenes
      createLivingRoomLightsScene(sceneManager);
      createKitchenLightsScene(sceneManager);
      
      System.out.println("✅ Initial setup complete:");
      System.out.println("   🏠 Living Room: Main Light + Lamp");
      System.out.println("   🍳 Kitchen: Main Light + Island Light + Security Camera");
      System.out.println("   🎬 Scenes: 'Living Room Lights On' + 'Kitchen Lights On'");
      
    } catch (Exception e) {
      System.err.println("❌ Error setting up initial data: " + e.getMessage());
    }
  }

  private static void createLivingRoomLightsScene(SceneManager sceneManager) {
    Scene livingRoomScene = new Scene("Living Room Lights On");
    
    // Turn on main light with 80% brightness
    Action mainLightAction = new Action("Living Room Main Light", "turnOn", "80");
    livingRoomScene.addAction(mainLightAction);
    
    // Turn on lamp with 60% brightness
    Action lampAction = new Action("Living Room Lamp", "turnOn", "60");
    livingRoomScene.addAction(lampAction);
    
    sceneManager.addScene(livingRoomScene);
  }

  private static void createKitchenLightsScene(SceneManager sceneManager) {
    Scene kitchenScene = new Scene("Kitchen Lights On");
    
    // Turn on main kitchen light with 90% brightness
    Action mainLightAction = new Action("Kitchen Main Light", "turnOn", "90");
    kitchenScene.addAction(mainLightAction);
    
    // Turn on island light with 70% brightness
    Action islandLightAction = new Action("Kitchen Island Light", "turnOn", "70");
    kitchenScene.addAction(islandLightAction);
    
    sceneManager.addScene(kitchenScene);
  }
}

package com.smarthome.scene;

import com.smarthome.app.CommandExecutor;
import com.smarthome.app.HomeManager;
import com.smarthome.devices.Device;
import com.smarthome.exceptions.DeviceNotFoundException;
import com.smarthome.exceptions.SceneExecutionException;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class SceneManager {
  private final Map<String, Scene> scenes;
  private final HomeManager homeManager; // Add dependency

  public SceneManager(HomeManager homeManager) {
    scenes = new LinkedHashMap<>();
    this.homeManager = homeManager;
  }

  public HomeManager getHomeManager() {
    return homeManager;
  }

  public boolean addScene(Scene scene) {
    if (scene == null || scene.getName() == null) return false;
    return scenes.putIfAbsent(scene.getName(), scene) == null;
  }

  public Scene getSceneByName(String name) {
    return scenes.get(name);
  }

  public boolean removeScene(String name) {
    return scenes.remove(name) != null;
  }

  public Collection<Scene> getScenes() {
    return Collections.unmodifiableCollection(scenes.values());
  }

  public void run(String sceneName) {
    Scene s = scenes.get(sceneName);
    if (s == null) return;
    for (Action a : s.getActions()) {
      System.out.println(
          "Execute: device="
              + a.getDeviceId()
              + ", command="
              + a.getCommand()
              + (a.getValue() != null ? ", value=" + a.getValue() : ""));
    }
  }

  public void executeScene(String sceneName) throws SceneExecutionException {
    Scene scene = scenes.get(sceneName);
    if (scene == null) {
      throw new SceneExecutionException("Scene not found: " + sceneName);
    }
    executeScene(scene);
  }

  public void executeScene(Scene scene) throws SceneExecutionException {
    if (scene == null) {
      throw new SceneExecutionException("Scene cannot be null");
    }

    CommandExecutor commandExecutor = new CommandExecutor();

    for (Action action : scene.getActions()) {
      try {
        Device device = homeManager.getDevicebyName(action.getDeviceId());
        if (device == null) {
          throw new DeviceNotFoundException("Device not found: " + action.getDeviceId());
        }

        // Use proper command execution
        commandExecutor.execute(device, action.getCommand(), action.getValue());
      } catch (Exception e) {
        // Print error but continue with other actions
        System.err.println("Failed to execute action: " + action + ", Error: " + e.getMessage());
      }
    }
  }
}

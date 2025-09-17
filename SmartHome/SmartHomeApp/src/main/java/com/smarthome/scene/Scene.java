package com.smarthome.scene;

import java.util.ArrayList;
import java.util.List;

public class Scene {
  private final String name;
  private final List<Action> actions;

  public Scene(String name) {
    this.name = name;
    this.actions = new ArrayList<>();
  }

  public String getName() {
    return name;
  }

  public List<Action> getActions() {
    return new ArrayList<>(actions);
  }

  public void addAction(Action action) {
    actions.add(action);
  }

  public void removeAction(Action action) {
    actions.remove(action);
  }
}

package com.smarthome.scene;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import org.junit.jupiter.api.Test;

class SceneTest {

  @Test
  void testGetName() {
    Scene scene = new Scene("Morning Routine");
    assertEquals("Morning Routine", scene.getName());
  }

  @Test
  void testAddAndGetActions() {
    Scene scene = new Scene("Test Scene");
    Action action = new Action("Device1", "TurnOn");

    scene.addAction(action);

    List<Action> actions = scene.getActions();
    assertEquals(1, actions.size());
    assertEquals(action, actions.get(0));
  }

  @Test
  void testRemoveAction() {
    Scene scene = new Scene("Test Scene");
    Action action = new Action("Device1", "TurnOn");

    scene.addAction(action);
    scene.removeAction(action);

    assertTrue(scene.getActions().isEmpty());
  }

  @Test
  void testGetActionsReturnsCopy() {
    Scene scene = new Scene("Test Scene");
    Action action = new Action("Device1", "TurnOn");
    scene.addAction(action);

    List<Action> actions = scene.getActions();
    actions.clear(); // should not affect the original list

    assertEquals(1, scene.getActions().size());
  }
}

package com.codedifferently;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class SceneManager {
    private final Map<String, Scene> scenes = new LinkedHashMap<>();

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
        run(s);
    }

    public void run(Scene scene) {
        if (scene == null) return;
        for (Action a : scene.getActions()) {
            System.out.println(
                "Execute: device=" + a.getDeviceId()
                + ", command=" + a.getCommand()
                + (a.getValue() != null ? ", value=" + a.getValue() : "")
            );
        }
    }
}

package com.codedifferently;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class SceneManager {
    private final Map<String, Scene> scenes = new LinkedHashMap<>();
    private final ActionExecutor executor;

    public SceneManager(ActionExecutor executor) {
        this.executor = executor;
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
        run(scenes.get(sceneName));
    }

    public void run(Scene scene) {
        if (scene == null) return;
        for (Action a : scene.getActions()) {
            executor.execute(a);
        }
    }

    public void run() {
        for (Scene s : getScenes()) {
            run(s);
        }
    }
}

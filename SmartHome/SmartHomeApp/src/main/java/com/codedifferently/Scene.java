package com.codedifferently;

import java.util.ArrayList;
import java.util.List;

public class Scene {
    private String name;
    private List<Action> actions;

    public Scene(String name) {
        this.name = name;
        this.actions = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void addAction(Action action) {
        this.actions.add(action);
    }

    public List<Action> getActions() {
        return actions;
    }
}
package com.smarthome.cli;

import com.smarthome.app.HomeManager;
import com.smarthome.scene.ConsoleNotificationService;
import com.smarthome.scene.RuleEngine;
import com.smarthome.scene.SceneManager;

import java.util.Scanner;

public class SmartHomeCLI {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        HomeManager homeManager = new HomeManager("Account123");

        // Attach scene + rules
        SceneManager sceneManager = new SceneManager(homeManager);
        RuleEngine ruleEngine = new RuleEngine(sceneManager, new ConsoleNotificationService());
        homeManager.setSceneManager(sceneManager);
        homeManager.setRuleEngine(ruleEngine);

        HomePrompter prompter = new HomePrompter();
        prompter.startMenuLoop();
    }
}

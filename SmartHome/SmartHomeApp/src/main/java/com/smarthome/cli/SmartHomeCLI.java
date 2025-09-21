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
        SceneManager sceneManager = new SceneManager(homeManager);
        RuleEngine ruleEngine = new RuleEngine(sceneManager, new ConsoleNotificationService());

        // Pass all dependencies to HomePrompter
        HomePrompter prompter = new HomePrompter(scanner, homeManager, sceneManager, ruleEngine);
        prompter.startMenuLoop();
        scanner.close();
    }
}

package com.smarthome.rules;

import java.time.LocalTime;

public class RuleTest {
    public static void main(String[] args) {
        Rule r = new Rule("MOTION_DETECTED","dev1","NightScene",
                LocalTime.of(23,0), LocalTime.of(23,59));
        boolean ok1 = "MOTION_DETECTED".equals(r.getTriggerEvent());
        boolean ok2 = r.isActiveNow(LocalTime.of(23,30));
        boolean ok3 = !r.isActiveNow(LocalTime.of(0,0));
        boolean threw = false;
        try {
            new Rule("E","D","S", LocalTime.of(10,0), LocalTime.of(9,0));
        } catch (IllegalArgumentException e) {
            threw = true;
        }
        if (ok1 && ok2 && ok3 && threw) {
            System.out.println("RuleTest: PASS");
        } else {
            System.out.println("RuleTest: FAIL");
            System.exit(1);
        }
    }
}

# Smart Home System User Stories

## Story 1 

***As a*** homeowner
***I want*** an automation rule that, after 11pm, turns on hallway lights when motion is detected and sends me an alert
***so that*** I can safely move at night.

### Acceptance Criteria

- Given a device with a unique `deviceId` and `room`, when I add it, then it appears in the device list.
- Given a linked switchable device, when I issue `turnOn()` or `turnOff()`, then the device state updates and is persisted in the registry.
- Given a non-existent `deviceId`, when I call any command, then I receive a `DeviceNotFoundException`.



## Story 2 

***As a*** homeowner
***I want*** to create a “Scene” that runs multiple device actions (e.g., dim lights, set thermostat)
***so that*** I can change my home’s mood with one command.

### Acceptance Criteria

- Given a named scene with a list of device actions, when I save it, then it is stored and retrievable.
- When I run the scene, then all actions execute in order, and any failures are reported.
- If an action targets an unsupported capability (e.g., setBrightness on a Thermostat), then an `InvalidCommandException` is raised and the scene reports partial success.



## Story 3

***As a*** homeowner
***I want*** an automation rule that, after 11pm, turns on hallway lights when motion is detected and sends me an alert
***so that*** I can safely move at night.

### Acceptance Criteria

- Given a motion event from a camera sensor after 23:00, when the Rule Engine evaluates, then it turns on the lights in the configured scene within 2 seconds and triggers a notification.
- If another rule conflicts (e.g., a “Do Not Disturb” rule), then a `RuleConflictException` is logged and the engine resolves by priority.
- If the target light device is missing, then a `DeviceNotFoundException` is reported, and the rule execution status is “failed.”


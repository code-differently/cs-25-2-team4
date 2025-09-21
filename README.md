# Smart Home Manager

A **Java-based Smart Home CLI** for managing devices, rooms, rules, and scenes. Demonstrates object-oriented design, SOLID principles, custom exceptions, and testing.

## Features
- **Devices**: Light, Thermostat, Security Camera  
- **Rooms**: Add/remove rooms, assign devices  
- **Scenes**: Group device actions (e.g., *“Movie Night”*)  
- **Rules**: Automate actions based on events/time  
- **Notifications**: Alerts when rules are triggered  
- **Custom Exceptions**:  
  - `DeviceNotFoundException` – when a device does not exist  
  - `RoomNotFoundException` – when a room does not exist  
  - `InvalidCommandException` – for invalid CLI input  
  - `RuleConflictException` – when rules conflict  
  - `SceneExecutionException` – when a scene fails to execute  

## Build & Run with Gradle

### Run CLI
```bash
./gradlew run --console=plain
```

### Run Test
```bash
./gradlew test
```

## Example CLI
```bash
1. Add Room
2. Add Device
3. List Rooms
4. Trigger Scene
5. Configure Rule
6. Exit
```

## Sample Session
```bash
> Add Room: Living Room
> Add Device: Light L1, Thermostat T1, Camera C1
> Create Scene: Night Comfort → Lights off, Thermostat 68°F, Camera records
> Rule: At 11PM trigger "Night Comfort"
```

## SOLID Design
- S: Each class has one role
- O: Add new devices/scenes without changing existing code
- L: All devices substitute the base `Device` type
- I: `NotificationService` exposes only necessary behavior
- D: High-level modules depend on abstractions, not concrete implementations

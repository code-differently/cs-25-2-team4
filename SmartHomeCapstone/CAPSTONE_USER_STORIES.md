# Smart Home App User Stories

## User Story 1: Device Registration

**As a Home Owner,**  
I want to add new smart devices to my home system and be able to delete old ones,  
**So that** I can expand my network and monitor or control additional devices.

### Acceptance Criteria

- **Given** the user is logged into the app,  
   **When** they navigate to the *Device Registration* section,  
   **Then** the system must display an option to **Add New Device**.

- **When** the user provides the required device details and confirms,  
  **Then** the device is registered and associated with the user's account.

- **If** the registration is successful,  
  **Then** the new device must appear on the dashboard with its name, category, and default status values.
   

## User Story 2: Device Status Dashboard (Data Retrieval)

**As a Home Owner,**  
I want to view a dynamic dashboard displaying the current status (such as temperature, power state, and battery level) of all registered smart devices,  
**So that** I can quickly monitor the key elements of my home environment without navigating multiple screens.

### Acceptance Criteria

- **Given** the user logs into the app,  
  **When** the dashboard loads,  
  **Then** all connected devices must be fetched. 

- The dashboard must successfully display the **name** and relevant **status attributes** (e.g., temperature, ON/OFF state, battery life) for each device and categorize them (e.g., Thermostat, Light, Door Lock).

- **If** the backend service is unavailable,  
  **Then** the dashboard must display a user-friendly error message: (e.g., “Device status currently unavailable.”).

- All displayed status data must be correctly **mapped** from the backend’s data structure to the frontend’s format  
  (e.g., convert `true/false` to **ON/OFF**).


## User Story 3: Device Control and State Persistence (Data Persistence)

**As a Home Owner,**  
I want to adjust the target temperature for my smart thermostat and toggle a smart bulb's power state (ON/OFF) via the app,  
**So that** I can control my home devices effectively and see the updated state immediately saved to the system.

### Acceptance Criteria

- **Given** a user clicks the **ON/OFF toggle** for a light,   
  **Then** the local UI must immediately update to reflect the new state (ON to OFF or vice versa).

- **Given** a user enters a new temperature value for the thermostat,  
  **When** they save the change,  
  **Then** the new setting must persist.

- The control interface must include **client-side validation**  
  (e.g., temperature inputs must be numeric and within a reasonable range: **50–90°F**).

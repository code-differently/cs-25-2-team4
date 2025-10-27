# Smart Home Automation (Capstone)

Full-stack smart-home app (React frontend + Spring Boot backend). Control Cameras, Lights, and Thermostats from one UI.

## Features
- **Camera** — live view; central delete confirm
- **Light** — color + brightness; Thermostat-style toggle; dims when off
- **Thermostat** — large dial + setpoint slider; toggle; dims when off
- **Modal Manager** — opens the right modal; shared ConfirmDeleteModal

## Structure
SmartHomeCapstone/
- backend/ — Spring Boot API  
- frontend/ — React app (CRA)

## Getting Started
### Backend
```bash
cd SmartHomeCapstone/backend
./mvnw spring-boot:run


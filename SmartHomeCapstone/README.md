# Smart Home Automation

## Project Overview

Welcome to the **Smart Home Automation** project! This application provides an intuitive and centralized web interface for monitoring, controlling, and managing smart devices within a home environment. Our goal is to simplify the smart home experience by consolidating various device controls and statuses into a single, user-friendly dashboard.

## The Team

* **Jonee McKellar** - Scrum Master / Project Lead

* **Danielson Adjocy** - Lead Developer

* **Trintie Jackson** - Lead Designer

* **Toby Evans** - Frontend Developer

## Screenshot

![Smart Home Dashboard Screenshot](Screenshot 2025-10-23 at 2.18.10 PM.png)

## Description of the App

This React single-page application serves as the primary user interface for interacting with a smart home system. It allows homeowners to:

* **View a Dynamic Dashboard:** Get a real-time overview of all registered smart devices, displaying their current status (e.g., temperature, ON/OFF state, battery level).

* **Control Devices:** Adjust settings for devices like smart thermostats (setting target temperatures) and smart lights (toggling power state) directly from the dashboard.

* **Register New Devices:** Easily add new smart devices to the home system, expanding the network's capabilities.

The application communicates with a dedicated backend web service to retrieve and persist device data, ensuring all controls and statuses are up-to-date and reliably stored.

## Demo Link

Experience the live application here:

https://cs-25-2-team4.vercel.app/

## Installation Instructions

To get a local copy of this project up and running on your machine, follow these steps:

### Prerequisites

* Node.js (LTS version recommended)

* npm (usually comes with Node.js) or Yarn

* Git

### Setup

1. **Clone the repository:**
2. **Install dependencies:**
3. **Configure Environment Variables:**
4. **Run the application locally:**
5. **Run Tests:**

## Known Issues

* **External Registration Latency:** Registering devices using external services (Apple/Google sign-in) is noticeably slower than manual registration, and the UI currently lacks a visual loading indicator, potentially confusing the user.

## Roadmap Features

We have exciting plans for future enhancements to elevate the smart home experience:

* **User Authentication & Authorization:** Implement secure login, registration, and user-specific device management.

* **Third-Party API Integration:** Incorporate external services like local weather forecasts, calendar integration, or voice assistant commands.

* **Advanced Automations & Scenes:** Allow users to create custom scenes (e.g., "Goodnight" to dim lights, lock doors) and set up conditional rules.

* **Device History & Analytics:** Display usage graphs for energy consumption, temperature trends, etc.

* **Improved Device Categories:** Enhance categorization and filtering of devices.

* **Notifications:** Implement real-time alerts for critical events (e.g., door unlocked, motion detected).

## Credits

* Built with React.js

* Deployment & CI/CD powered by Vercel

* Iconography sourced from **Font Awesome / Material Icons / etc.
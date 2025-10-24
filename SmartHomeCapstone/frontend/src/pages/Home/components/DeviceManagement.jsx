import React, { useState } from "react";
import { DevicesHeader } from "./DevicesHeader.jsx";
import { DevicesList } from "./DevicesList.jsx";

export const DeviceManagement = ({
  rooms,
  devices,
  activeRoom,
  searchTerm,
  onAddDevice,
  onToggleDevice,
  onCameraOpen,
  onActivateRoom,
}) => {
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [deviceError, setDeviceError] = useState("");
  const [deviceTypeError, setDeviceTypeError] = useState("");
  const [fadeOutDevice, setFadeOutDevice] = useState(false);

  const handleAddDeviceClick = () => {
    const realRooms = rooms.filter((r) => r.name !== "All");

    if (realRooms.length === 0) {
      showError("Create a room first");
      return;
    }

    // Reset ALL form fields when opening the form
    setDeviceName("");
    setDeviceType("");
    setSelectedRoom("");
    setDeviceError("");
    setDeviceTypeError("");
    setFadeOutDevice(false);
    setShowAddDeviceForm(true);
  };

  const showError = (message, isTypeError = false) => {
    if (isTypeError) {
      setDeviceTypeError(message);
    } else {
      setDeviceError(message);
    }
    setFadeOutDevice(false);
    setTimeout(() => setFadeOutDevice(true), 1500);
    setTimeout(() => {
      setDeviceError("");
      setDeviceTypeError("");
      setFadeOutDevice(false);
    }, 2250);

    // Always dispatch global error for "All" room collection
    window.dispatchEvent(
      new CustomEvent("deviceError", {
        detail: {
          roomName: activeRoom,
          errorMessage: message,
          errorType: isTypeError ? "type" : "name",
        },
      })
    );
  };

  const handleSaveDevice = async () => {
    const realRooms = rooms.filter((r) => r.name !== "All");
    const needsRoomSelection = activeRoom === "All" && realRooms.length > 1;

    // Collect missing fields
    const missingFields = [];

    if (!deviceName.trim()) {
      missingFields.push("name");
    }

    if (!deviceType) {
      missingFields.push("type");
    }
    
    if (needsRoomSelection && !selectedRoom) {
      missingFields.push("room");
    }

    // Show appropriate error message based on what's missing
    if (missingFields.length > 0) {
      let errorMessage = "";

      if (missingFields.length === 1) {
        errorMessage = `Device ${missingFields[0]} is required`;
      } else if (missingFields.length === 2) {
        // Handle all 2-field combinations
        if (missingFields.includes("name") && missingFields.includes("type")) {
          errorMessage = "Device name and type are required";
        } else if (missingFields.includes("name") && missingFields.includes("room")) {
          errorMessage = "Device name and room are required";
        } else if (missingFields.includes("type") && missingFields.includes("room")) {
          errorMessage = "Device type and room are required";
        }
      } else if (missingFields.length === 3) {
        errorMessage = "Device name, type, and room are required";
      }

      // Always show as name error for consistency, unless only type is missing
      const isTypeError = missingFields.length === 1 && missingFields[0] === "type";
      showError(errorMessage, isTypeError);
      return;
    }

    const roomToAssign = needsRoomSelection
      ? rooms.find((r) => r.name === selectedRoom)
      : activeRoom === "All"
      ? realRooms[0]
      : rooms.find((r) => r.name === activeRoom);

    if (!roomToAssign) {
      showError("Room selection is required");
      return;
    }

    try {
      // Create device
      const deviceData = {
        deviceName: deviceName.trim(),
        deviceType: deviceType,
        roomId: roomToAssign.id,
      };

      await onAddDevice(deviceData);

      // Reset form
      setDeviceName("");
      setSelectedRoom("");
      setShowAddDeviceForm(false);
      setDeviceError("");
      setDeviceType("");
      setDeviceTypeError("");

      onActivateRoom(roomToAssign.name);
    } catch (error) {
      showError(error.message || "Failed to add device");
    }
  };

  const handleCancelForm = () => {
    setShowAddDeviceForm(false);
    setDeviceName("");
    setSelectedRoom("");
    setDeviceError("");
    setDeviceType("");
    setDeviceTypeError("");
  };

  const handleRoomSelect = (roomName) => {
    setSelectedRoom(roomName);
  };

  return (
    <section className="devices-section">
      <DevicesHeader
        showForm={showAddDeviceForm}
        deviceError={deviceError}
        fadeError={fadeOutDevice}
        onOpenForm={handleAddDeviceClick}
        // Form props
        rooms={rooms}
        activeRoom={activeRoom}
        deviceName={deviceName}
        deviceType={deviceType}
        selectedRoom={selectedRoom}
        deviceTypeError={deviceTypeError}
        // Form actions
        onDeviceNameChange={setDeviceName}
        onDeviceTypeChange={setDeviceType}
        onRoomSelect={handleRoomSelect}
        onSaveDevice={handleSaveDevice}
        onCancelForm={handleCancelForm}
      />

      <DevicesList
        devices={devices}
        activeRoom={activeRoom}
        rooms={rooms}
        searchTerm={searchTerm}
        onToggle={onToggleDevice}
        onCameraOpen={onCameraOpen}
      />
    </section>
  );
};

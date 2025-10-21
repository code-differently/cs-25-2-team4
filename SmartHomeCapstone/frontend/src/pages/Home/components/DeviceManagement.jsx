import React, { useState } from "react";
import { DevicesHeader } from "./DevicesHeader.jsx";
import { DevicesList } from "./DevicesList.jsx";

export const DeviceManagement = ({
  rooms,
  devices,
  activeRoom,
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
  };

  const handleSaveDevice = () => {
    if (!deviceName.trim()) {
      showError("Device name is required");
      return;
    }

    if (!deviceType) {
      showError("Device type is required", true);
      return;
    }

    const realRooms = rooms.filter((r) => r.name !== "All");
    const roomToAssign =
      activeRoom === "All"
        ? realRooms.length === 1
          ? realRooms[0].name
          : selectedRoom
        : activeRoom;

    if (!roomToAssign) return;

    onAddDevice({
      name: deviceName.trim(),
      room: roomToAssign,
      type: deviceType,
      isOn: false,
    });

    // Reset form
    setDeviceName("");
    setSelectedRoom("");
    setShowAddDeviceForm(false);
    setDeviceError("");
    setDeviceType("");
    setDeviceTypeError("");

    onActivateRoom(roomToAssign);
  };

  const handleCancelForm = () => {
    setShowAddDeviceForm(false);
    setDeviceName("");
    setSelectedRoom("");
    setDeviceError("");
    setDeviceType("");
    setDeviceTypeError("");
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
        onRoomSelect={setSelectedRoom}
        onSaveDevice={handleSaveDevice}
        onCancelForm={handleCancelForm}
      />

      <DevicesList
        devices={devices}
        activeRoom={activeRoom}
        onToggle={onToggleDevice}
        onCameraOpen={onCameraOpen}
      />
    </section>
  );
};
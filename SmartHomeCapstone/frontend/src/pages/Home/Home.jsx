import React, { useState } from "react";
import "./Home.css";
import { RoomsBar } from "./RoomsBar.jsx";
import { DevicesList } from "./DevicesList.jsx";
import { CameraModal } from "./CameraModal.jsx";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal.jsx";
import { AddDeviceForm } from "./AddDeviceForm.jsx";
import { useDevices } from "./hooks/useDevices";
import { useRooms } from "./hooks/useRooms";

/* ==================== Home Component ==================== */
export const Home = () => {
  /* ==================== State ==================== */
  const {
    rooms,
    roomError,
    fadeOutRoom,
    newRoomName,
    showAddRoomForm,
    openAddRoomForm,
    cancelAddRoomForm,
    setNewRoomName,
    activateRoom,
    addRoom,
  } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState("");

  const { devices, addDevice, toggleDevice, deleteDevice } = useDevices();

  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceError, setDeviceError] = useState("");
  const [fadeOutDevice, setFadeOutDevice] = useState(false);
  const [deviceType, setDeviceType] = useState("");
  const [deviceTypeError, setDeviceTypeError] = useState("");

  // === Camera Modal State ===
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openCameraModal = (device) => {
    setSelectedDevice(device);
    setModalType("camera");
  };

  const closeModal = () => {
    setSelectedDevice(null);
    setModalType(null);
  };

  const requestDeleteDevice = (device) => {
    setSelectedDevice(device);
    setModalType("confirm-delete");
  };

  const confirmDeleteDevice = () => {
    if (!selectedDevice) return;
    deleteDevice(selectedDevice.name);
    closeModal();
  };

  const returnToCameraModal = () => {
    setModalType("camera");
  };

  /* === Device Handlers === */
  const handleAddDeviceClick = () => {
    const realRooms = rooms.filter((r) => r.name !== "All");

    if (realRooms.length === 0) {
      setDeviceError("Create a room first");
      setFadeOutDevice(false);
      setTimeout(() => setFadeOutDevice(true), 1500);
      setTimeout(() => {
        setDeviceError("");
        setFadeOutDevice(false);
      }, 2250);
      return;
    }

    setShowAddDeviceForm(true);
  };

  const handleSaveDevice = () => {
    const activeRoom = rooms.find((r) => r.active)?.name;

    if (!deviceName.trim()) {
      setDeviceError("Device name is required");
      setFadeOutDevice(false);
      setTimeout(() => setFadeOutDevice(true), 1500);
      setTimeout(() => {
        setDeviceError("");
        setFadeOutDevice(false);
      }, 2250);
      return;
    }

    if (!deviceType) {
      setDeviceTypeError("Device type is required");
      setFadeOutDevice(false);
      setTimeout(() => setFadeOutDevice(true), 1500);
      setTimeout(() => {
        setDeviceTypeError("");
        setFadeOutDevice(false);
      }, 2250);
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

    addDevice({
      name: deviceName.trim(),
      room: roomToAssign,
      type: deviceType,
      isOn: false,
    });

    setDeviceName("");
    setSelectedRoom("");
    setShowAddDeviceForm(false);
    setDeviceError("");
    setDeviceType("");

    activateRoom(roomToAssign);
  };

  const handleToggle = (deviceNameToFlip) => {
    toggleDevice(deviceNameToFlip);
    setSelectedDevice((prev) => {
      if (!prev || prev.name !== deviceNameToFlip) return prev;
      return {
        ...prev,
        isOn: !prev.isOn,
        status: !prev.isOn ? "Online" : "Offline",
      };
    });
  };

  /* === Derived Values === */
  const activeRoom = rooms.find((r) => r.active)?.name;

  /* ==================== Render ==================== */
  return (
    <div className="home">

      {/* === Rooms Bar === */}
      <RoomsBar
        rooms={rooms}
        showAddRoomForm={showAddRoomForm}
        newRoomName={newRoomName}
        roomError={roomError}
        fadeOutRoom={fadeOutRoom}
        onRoomClick={activateRoom}
        onAddRoomClick={openAddRoomForm}
        onNewRoomNameChange={setNewRoomName}
        onSaveRoom={addRoom}
        onCancelAddRoom={cancelAddRoomForm}
      />

      {/* === Devices Section === */}
      <section className="devices-section">
        <div className="devices-header">
          {/* --- Devices Header & Add Button --- */}
          <h2>My Devices</h2>

          {!showAddDeviceForm && (
            <button
              data-testid="add-device-btn"
              className="add-device-btn"
              onClick={handleAddDeviceClick}
            >
              + Add Device
            </button>
          )}

          {showAddDeviceForm && (
            <AddDeviceForm
              rooms={rooms}
              activeRoom={activeRoom}
              deviceName={deviceName}
              deviceType={deviceType}
              selectedRoom={selectedRoom}
              deviceError={deviceError}
              deviceTypeError={deviceTypeError}
              fadeOutDevice={fadeOutDevice}
              onDeviceNameChange={setDeviceName}
              onDeviceTypeChange={setDeviceType}
              onRoomSelect={setSelectedRoom}
              onSave={handleSaveDevice}
              onCancel={() => setShowAddDeviceForm(false)}
            />
          )}

          {/* --- Device Error Toast --- */}
          {deviceError && (
            <div
              className={`toast-device-error ${fadeOutDevice ? "fade-out" : ""}`}
            >
              {deviceError}
            </div>
          )}
        </div>

        {/* === Devices List === */}
        <DevicesList
          devices={devices}
          activeRoom={activeRoom}
          onToggle={handleToggle}
          onCameraOpen={openCameraModal}
        />
      </section>
      {/* === CAMERA MODAL === */}
      {modalType === "camera" && selectedDevice && (
        <CameraModal
          device={selectedDevice}
          onClose={closeModal}
          onToggle={handleToggle}
          onRequestDelete={requestDeleteDevice}
        />
      )}

      {/* === CONFIRM DELETE MODAL (overlay above camera modal) === */}
      {modalType === "confirm-delete" && selectedDevice && (
        <div className="confirm-overlay">
          <ConfirmDeleteModal
            deviceName={selectedDevice.name}
            onConfirm={confirmDeleteDevice}
            onCancel={returnToCameraModal}
          />
        </div>
      )}
    </div>
  );
};

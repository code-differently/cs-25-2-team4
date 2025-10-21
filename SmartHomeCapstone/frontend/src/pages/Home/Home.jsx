import React, { useState } from "react";
import "./Home.css";
import { RoomsBar } from "./RoomsBar.jsx";
import { DevicesList } from "./DevicesList.jsx";
import { CameraModal } from "./CameraModal.jsx";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal.jsx";
import { AddDeviceForm } from "./AddDeviceForm.jsx";

/* ==================== Home Component ==================== */
export const Home = () => {
  /* ==================== State ==================== */
  const [rooms, setRooms] = useState([{ name: "All", active: true }]);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomError, setRoomError] = useState("");
  const [fadeOutRoom, setFadeOutRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [devices, setDevices] = useState([]);
  const [deviceError, setDeviceError] = useState("");
  const [fadeOutDevice, setFadeOutDevice] = useState(false);
  const [deviceType, setDeviceType] = useState("");
  const [deviceTypeError, setDeviceTypeError] = useState("");

  // === Camera Modal State ===
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalType, setModalType] = useState(null); // "camera" | "confirm-delete" | null

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
    setDevices((prev) => prev.filter((d) => d.name !== selectedDevice.name));
    closeModal();
  };

  const returnToCameraModal = () => {
    setModalType("camera");
  };

  /* === Room Handlers === */
  const handleAddRoomClick = () => setShowAddRoomForm(true);

  const handleSaveRoom = () => {
    if (!newRoomName.trim()) {
      setRoomError("Room name is required");
      setFadeOutRoom(false);
      setTimeout(() => {
        setFadeOutRoom(true);
      }, 1500);
      setTimeout(() => {
        setRoomError("");
        setFadeOutRoom(false);
      }, 2250);
      return;
    }

    setRoomError("");
    const updatedRooms = rooms.map((r) => ({ ...r, active: false }));
    const newRoom = { name: newRoomName.trim(), active: true };
    setRooms([...updatedRooms, newRoom]);
    setNewRoomName("");
    setShowAddRoomForm(false);
  };

  const handleRoomClick = (roomName) => {
    setRooms(rooms.map((r) => ({ ...r, active: r.name === roomName })));
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

    const offStatusByType = {
      Light: "Off",
      Thermostat: "Idle",
      Camera: "Offline",
    };

    setDevices([
      ...devices,
      {
        name: deviceName.trim(),
        room: roomToAssign,
        type: deviceType,
        status: offStatusByType[deviceType],
        isOn: false,
      },
    ]);

    setDeviceName("");
    setSelectedRoom("");
    setShowAddDeviceForm(false);
    setDeviceError("");
    setDeviceType("");

    setShowAddRoomForm(false);

    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        active: r.name === roomToAssign,
      })),
    );
  };

  const handleToggle = (deviceNameToFlip) => {
    const statusByType = {
      Light: "On",
      Thermostat: "Set to 72°F",
      Camera: "Online",
    };

    const offStatusByType = {
      Light: "Off",
      Thermostat: "Idle",
      Camera: "Offline",
    };

    setDevices((prev) =>
      prev.map((d) => {
        if (d.name !== deviceNameToFlip) return d;
        const nextOn = !d.isOn;
        return {
          ...d,
          isOn: nextOn,
          status: nextOn ? statusByType[d.type] : offStatusByType[d.type],
        };
      }),
    );

    // keep modal's selected device in sync
    setSelectedDevice((prev) => {
      if (!prev || prev.name !== deviceNameToFlip) return prev;
      const nextOn = !prev.isOn;
      return {
        ...prev,
        isOn: nextOn,
        status: nextOn ? statusByType[prev.type] : offStatusByType[prev.type],
      };
    });
  };

  /* === Derived Values === */
  const activeRoom = rooms.find((r) => r.active)?.name;

  /* ==================== Render ==================== */
  return (
    <div className="home">
      {/* === Room Error Toast === */}
      {roomError && (
        <div className={`toast-room-error ${fadeOutRoom ? "fade-out" : ""}`}>
          {roomError}
        </div>
      )}

      {/* === Rooms Bar === */}
      <RoomsBar
        rooms={rooms}
        showAddRoomForm={showAddRoomForm}
        newRoomName={newRoomName}
        roomError={roomError}
        fadeOutRoom={fadeOutRoom}
        onRoomClick={handleRoomClick}
        onAddRoomClick={handleAddRoomClick}
        onNewRoomNameChange={setNewRoomName}
        onSaveRoom={handleSaveRoom}
        onCancelAddRoom={() => setShowAddRoomForm(false)}
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

import React from "react";
import "./Home.css";
import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { useRooms } from "./hooks/useRooms";
import { RoomDeviceCoordinator } from "./components/RoomDeviceCoordinator.jsx";
import { ModalManager, useModalManager } from "./components/ModalManager.jsx";
import { ConfirmDeleteModal } from "./components/modals/ConfirmDeleteModal.jsx";

/* ==================== Home Component ==================== */
export const Home = () => {
  /* ==================== Custom Hooks ==================== */
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
    setRooms,
  } = useRooms();

  const { devices, addDevice, toggleDevice, deleteDevice, setDevices } =
    useDevices();

  const {
    selectedDevice,
    modalType,
    openCameraModal,
    closeModal,
    requestDeleteDevice,
    confirmDeleteDevice,
    returnToCameraModal,
    handleToggle,
  } = useModalManager(toggleDevice, deleteDevice);

  const [roomToDelete, setRoomToDelete] = useState(null);

  const handleRequestDeleteRoom = (roomName) => {
    closeModal();
    setRoomToDelete(roomName);
  };

  const handleConfirmDeleteRoom = () => {
    setRooms((prevRooms) => {
      const updated = prevRooms.filter((r) => r.name !== roomToDelete);
      return updated.map((r) => ({
        ...r,
        active: r.name === "All",
      }));
    });

    setDevices((prev) => prev.filter((d) => d.room !== roomToDelete));

    setRoomToDelete(null);
  };

  const handleCancelDeleteRoom = () => {
    setRoomToDelete(null);
  };

  /* ==================== Render ==================== */
  return (
    <div className="home">
      {/* Room and Device Management */}
      <RoomDeviceCoordinator
        rooms={rooms}
        devices={devices}
        showAddRoomForm={showAddRoomForm}
        newRoomName={newRoomName}
        roomError={roomError}
        fadeOutRoom={fadeOutRoom}
        onRoomClick={activateRoom}
        onAddRoomClick={openAddRoomForm}
        onNewRoomNameChange={setNewRoomName}
        onSaveRoom={addRoom}
        onCancelAddRoom={cancelAddRoomForm}
        onAddDevice={addDevice}
        onToggleDevice={handleToggle}
        onCameraOpen={openCameraModal}
        onDeleteRoom={handleRequestDeleteRoom}
      />

      {/* Modal Management */}
      <ModalManager
        selectedDevice={selectedDevice}
        modalType={modalType}
        onClose={closeModal}
        onToggleDevice={handleToggle}
        onDeleteDevice={deleteDevice}
        onRequestDelete={requestDeleteDevice}
        onConfirmDelete={confirmDeleteDevice}
        onReturnToCamera={returnToCameraModal}
      />

      {roomToDelete && (
        <div className="confirm-overlay">
          <ConfirmDeleteModal
            type="room"
            targetName={roomToDelete}
            onConfirm={handleConfirmDeleteRoom}
            onCancel={handleCancelDeleteRoom}
          />
        </div>
      )}
    </div>
  );
};

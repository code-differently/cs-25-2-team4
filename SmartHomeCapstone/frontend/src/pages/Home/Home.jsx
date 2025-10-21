import React from "react";
import "./Home.css";
import { useDevices } from "./hooks/useDevices";
import { useRooms } from "./hooks/useRooms";
import { RoomDeviceCoordinator } from "./components/RoomDeviceCoordinator.jsx";
import { ModalManager, useModalManager } from "./components/ModalManager.jsx";

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
  } = useRooms();

  const { devices, addDevice, toggleDevice, deleteDevice } = useDevices();

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
    </div>
  );
};

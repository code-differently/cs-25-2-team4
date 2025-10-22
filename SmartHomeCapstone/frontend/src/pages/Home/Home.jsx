import React from "react";
import "./Home.css";
import { useDevices } from "../../hooks/useDevices";
import { useRooms } from "../../hooks/useRooms";
import { RoomDeviceCoordinator } from "./components/RoomDeviceCoordinator.jsx";
import { ModalManager, useModalManager } from "./components/ModalManager.jsx";

/* ==================== Home Component ==================== */
const Home = () => {
  /* ==================== Custom Hooks ==================== */
  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
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

  const { devices, loading, error, addDevice, toggleDevice, deleteDevice } = useDevices();

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
  if (loading || roomsLoading) {
    return (
      <div className="home">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || roomsError) {
    return (
      <div className="home">
        <div className="error">Error loading data: {error || roomsError}</div>
      </div>
    );
  }

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
export default Home;
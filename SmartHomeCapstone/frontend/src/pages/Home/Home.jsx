import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useState } from "react";
import { useDevices } from "../../hooks/useDevices";
import { useRooms } from "../../hooks/useRooms";
import { useHomes } from "../../hooks/useHomes";
import { useUser } from "../../context/UserContext";
import { RoomDeviceCoordinator } from "./components/RoomDeviceCoordinator.jsx";
import { ModalManager, useModalManager } from "./components/ModalManager.jsx";
import CreateHome from "../CreateHome/CreateHome.jsx";

/* ==================== Home Component ==================== */
const Home = () => {
  const { backendUser } = useUser();
  const navigate = useNavigate();
  import { ConfirmDeleteModal } from "./components/modals/ConfirmDeleteModal.jsx";
  import { Header } from "../../components/header/Header.jsx";
  const [searchTerm, setSearchTerm] = useState("");

  /* ==================== Custom Hooks ==================== */
  const {
    homes,
    currentHome,
    loading: homesLoading,
    error: homesError,
    refreshHomes,
  } = useHomes(backendUser?.clerkId);

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
    setRooms,
  } = useRooms(currentHome?.homeId);

  const { devices, loading, error, addDevice, toggleDevice, deleteDevice, setDevices } =
    useDevices(currentHome?.homeId);

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

  /* ==================== Check for Fresh Registration ==================== */
  useEffect(() => {
    if (!homesLoading && backendUser) {
      const isFreshRegistration = sessionStorage.getItem('freshRegistration');
      
      if (isFreshRegistration && homes.length === 0) {
        // Clear the flag and redirect to create home
        sessionStorage.removeItem('freshRegistration');
        navigate("/createhome");
      }
    }
  }, [homesLoading, backendUser, homes, navigate]);

  /* ==================== Event Handlers ==================== */
  const handleHomeCreated = (newHome) => {
    // Refresh homes to get the updated list
    refreshHomes();
  };
  
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

  /* ==================== Loading & Error States ==================== */
  if (!backendUser) {
    return (
      <div className="home">
        <div className="loading">Setting up your account...</div>
      </div>
    );
  }

  if (homesLoading) {
    return (
      <div className="home">
        <div className="loading">Loading your smart home...</div>
      </div>
    );
  }

  if (homesError) {
    return (
      <div className="home">
        <div className="error">Error setting up your home: {homesError}</div>
        <button onClick={refreshHomes}>Retry</button>
      </div>
    );
  }

  // Show CreateHome form if user has no homes
  if (homes.length === 0) {
    return <CreateHome onHomeCreated={handleHomeCreated} />;
  }

  if (!currentHome) {
    return (
      <div className="home">
        <div className="loading">Setting up your home...</div>
      </div>
    );
  }

  if (loading || roomsLoading) {
    return (
      <div className="home">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="loading">Loading your home data...</div>
      </div>
    );
  }

  if (error || roomsError) {
    return (
      <div className="home">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="error">Error loading data: {error || roomsError}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  /* ==================== Render Main Home Interface ==================== */
  return (
    <div className="home">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      {/* Room and Device Management */}
      <RoomDeviceCoordinator
        rooms={rooms}
        devices={devices}
        searchTerm={searchTerm}
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
export default Home;

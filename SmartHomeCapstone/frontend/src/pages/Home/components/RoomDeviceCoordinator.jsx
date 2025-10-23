import React from "react";
import { RoomsBar } from "../RoomsBar.jsx";
import { DeviceManagement } from "./DeviceManagement.jsx";

export const RoomDeviceCoordinator = ({
  rooms,
  devices,
  searchTerm,
  showAddRoomForm,
  newRoomName,
  roomError,
  fadeOutRoom,
  onRoomClick,
  onAddRoomClick,
  onNewRoomNameChange,
  onSaveRoom,
  onCancelAddRoom,
  onAddDevice,
  onToggleDevice,
  onCameraOpen,
}) => {
  const activeRoom = rooms.find((r) => r.active)?.name;

  return (
    <>
      {/* Rooms Bar */}
      <RoomsBar
        rooms={rooms}
        showAddRoomForm={showAddRoomForm}
        newRoomName={newRoomName}
        roomError={roomError}
        fadeOutRoom={fadeOutRoom}
        onRoomClick={onRoomClick}
        onAddRoomClick={onAddRoomClick}
        onNewRoomNameChange={onNewRoomNameChange}
        onSaveRoom={onSaveRoom}
        onCancelAddRoom={onCancelAddRoom}
      />

      {/* Device Management */}
      <DeviceManagement
        rooms={rooms}
        devices={devices}
        activeRoom={activeRoom}
        searchTerm={searchTerm}
        onAddDevice={onAddDevice}
        onToggleDevice={onToggleDevice}
        onCameraOpen={onCameraOpen}
        onActivateRoom={onRoomClick}
      />
    </>
  );
};
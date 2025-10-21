import React from "react";
import { AddDeviceForm } from "./modals/AddDeviceForm";

export const DevicesHeader = ({
  showForm,
  deviceError,
  fadeError,
  onOpenForm,
  // Form props
  rooms,
  activeRoom,
  deviceName,
  deviceType,
  selectedRoom,
  deviceTypeError,
  // Form actions
  onDeviceNameChange,
  onDeviceTypeChange,
  onRoomSelect,
  onSaveDevice,
  onCancelForm,
}) => {
  return (
    <div className="devices-header">
      <h2>My Devices</h2>

      {/* + Add Device Button */}
      {!showForm && (
        <button
          data-testid="add-device-btn"
          className="add-device-btn"
          onClick={onOpenForm}
        >
          + Add Device
        </button>
      )}

      {/* Add Device Form */}
      {showForm && (
        <AddDeviceForm
          rooms={rooms}
          activeRoom={activeRoom}
          deviceName={deviceName}
          deviceType={deviceType}
          selectedRoom={selectedRoom}
          deviceError={deviceError}
          deviceTypeError={deviceTypeError}
          fadeOutDevice={fadeError}
          onDeviceNameChange={onDeviceNameChange}
          onDeviceTypeChange={onDeviceTypeChange}
          onRoomSelect={onRoomSelect}
          onSave={onSaveDevice}
          onCancel={onCancelForm}
        />
      )}

      {/* Device Error Toast */}
      {deviceError && (
        <div className={`toast-device-error ${fadeError ? "fade-out" : ""}`}>
          {deviceError}
        </div>
      )}
    </div>
  );
};

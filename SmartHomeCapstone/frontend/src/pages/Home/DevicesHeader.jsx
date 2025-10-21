import React from "react";
import { AddDeviceForm } from "./AddDeviceForm";

export const DevicesHeader = ({ form, actions }) => {
  const {
    show, // boolean — showAddDeviceForm
    deviceError, // deviceError string
    fade, // fadeOutDevice
  } = form;

  return (
    <div className="devices-header">
      <h2>My Devices</h2>

      {/* + Add Device Button */}
      {!show && (
        <button
          data-testid="add-device-btn"
          className="add-device-btn"
          onClick={actions.open}
        >
          + Add Device
        </button>
      )}

      {/* Add Device Form */}
      {show && (
        <AddDeviceForm
          rooms={form.rooms}
          activeRoom={form.activeRoom}
          deviceName={form.name}
          deviceType={form.type}
          selectedRoom={form.selectedRoom}
          deviceError={form.deviceError}
          deviceTypeError={form.deviceTypeError}
          fadeOutDevice={form.fade}
          onDeviceNameChange={actions.changeName}
          onDeviceTypeChange={actions.changeType}
          onRoomSelect={actions.changeRoom}
          onSave={actions.save}
          onCancel={actions.cancel}
        />
      )}

      {/* Device Error Toast */}
      {deviceError && (
        <div className={`toast-device-error ${fade ? "fade-out" : ""}`}>
          {deviceError}
        </div>
      )}
    </div>
  );
};

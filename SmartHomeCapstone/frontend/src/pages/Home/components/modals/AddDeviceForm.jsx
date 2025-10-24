import React from "react";

export const AddDeviceForm = ({
  rooms,
  activeRoom,
  deviceName,
  deviceType,
  selectedRoom,
  deviceError,
  deviceTypeError,
  fadeOutDevice,
  onDeviceNameChange,
  onDeviceTypeChange,
  onRoomSelect,
  onSave,
  onCancel,
}) => {
  const realRooms = rooms.filter((r) => r.name !== "All");
  const shouldShowRoomSelect = activeRoom === "All" && realRooms.length > 1;

  return (
    <div className="add-device-form">
      <input
        placeholder="Device Name"
        value={deviceName}
        onChange={(e) => onDeviceNameChange(e.target.value)}
      />

      <select
        aria-label="Select Type"
        value={deviceType}
        onChange={(e) => onDeviceTypeChange(e.target.value)}
      >
        <option value="">-- Select Type --</option>
        <option value="LIGHT">Light</option>
        <option value="THERMOSTAT">Thermostat</option>
        <option value="CAMERA">Security Camera</option>
      </select>

      {deviceTypeError && (
        <div
          className={`toast-device-error ${fadeOutDevice ? "fade-out" : ""}`}
        >
          {deviceTypeError}
        </div>
      )}

      {shouldShowRoomSelect && (
        <select
          aria-label="Select Room"
          value={selectedRoom}
          onChange={(e) => onRoomSelect(e.target.value)}
        >
          <option value="">-- Select Room --</option>
          {realRooms.map((r, i) => (
            <option key={i} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      )}

      <button onClick={onSave}>
        Save
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

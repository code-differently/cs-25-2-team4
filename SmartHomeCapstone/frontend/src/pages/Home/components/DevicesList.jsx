import React from "react";
import { DeviceIcon } from "./DeviceIcon";

export const DevicesList = ({
  devices,
  activeRoom,
  rooms,
  onToggle,
  onCameraOpen,
}) => {
  // Get the active room object to find its ID
  const activeRoomObj = rooms?.find(r => r.name === activeRoom);
  
  const filteredDevices =
    activeRoom === "All"
      ? devices
      : devices.filter((d) => d.roomId === activeRoomObj?.id);

  if (activeRoom !== "All" && filteredDevices.length === 0) {
    return <p className="empty-devices-msg">No devices in this room yet</p>;
  }

  return (
    <div className="devices-grid">
      {filteredDevices.map((device, index) => (
        <div
          key={device.deviceId || index}
          data-testid="device-card"
          className={`device-card ${device.isOn ? "is-on" : "is-off"} ${
            device.deviceType === "CAMERA" ? "clickable" : ""
          }`}
          onClick={() => {
            if (device.deviceType === "CAMERA") onCameraOpen(device);
          }}
        >
          {/* === HEADER (icon + toggle) === */}
          <div className="device-card-header">
            <div className="device-head-left">
              <span className="icon-box">
                <DeviceIcon type={device.deviceType} />
              </span>
            </div>

            <label
              className="device-toggle"
              aria-label={`Toggle ${device.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={device.isOn}
                onChange={() => onToggle(device.deviceId, device.isOn)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* === NAME === */}
          <span className={`device-title ${device.isOn ? "" : "dim"}`}>
            {device.deviceName}
          </span>

          {/* === STATUS TEXT === */}
          <span
            className={`device-status-text ${
              device.isOn ? "" : "status-dim"
            }`}
          >
            {device.isOn ? 'ON' : 'OFF'}
          </span>
        </div>
      ))}
    </div>
  );
};

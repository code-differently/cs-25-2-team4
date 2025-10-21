import React from "react";
import { DeviceIcon } from "./DeviceIcon";

export const DevicesList = ({
  devices,
  activeRoom,
  onToggle,
  onCameraOpen,
}) => {
  const filteredDevices =
    activeRoom === "All"
      ? devices
      : devices.filter((d) => d.room === activeRoom);

  if (activeRoom !== "All" && filteredDevices.length === 0) {
    return <p className="empty-devices-msg">No devices in this room yet</p>;
  }

  return (
    <div className="devices-grid">
      {filteredDevices.map((device, index) => (
        <div
          key={index}
          data-testid="device-card"
          className={`device-card ${device.isOn ? "is-on" : "is-off"} ${
            device.type === "Camera" ? "clickable" : ""
          }`}
          onClick={() => {
            if (device.type === "Camera") onCameraOpen(device);
          }}
        >
          {/* === HEADER (icon + toggle) === */}
          <div className="device-card-header">
            <div className="device-head-left">
              <span className="icon-box">
                <DeviceIcon type={device.type} />
              </span>
            </div>

            <label
              className="device-toggle"
              aria-label={`Toggle ${device.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={!!device.isOn}
                onChange={() => onToggle(device.name)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* === NAME === */}
          <span className={`device-title ${device.isOn ? "" : "dim"}`}>
            {device.name}
          </span>

          {/* === STATUS TEXT === */}
          {device.status && (
            <span
              className={`device-status-text ${
                device.isOn ? "" : "status-dim"
              }`}
            >
              {device.status}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

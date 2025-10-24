import React from "react";
import { DeviceIcon } from "./DeviceIcon";

export const DevicesList = ({
  devices,
  activeRoom,
  rooms,
  searchTerm = "",
  onToggle,
  onCameraOpen, // This will now handle all device types
}) => {
  // Get the active room object to find its ID
  const activeRoomObj = rooms?.find((r) => r.name === activeRoom);

  // First filter by room
  const roomFilteredDevices =
    activeRoom === "All"
      ? devices
      : devices.filter((d) => d.roomId === activeRoomObj?.id);

  // Then filter by search term
  const filteredDevices = searchTerm
    ? roomFilteredDevices.filter(
        (device) =>
          device.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : roomFilteredDevices;

  // Check if a device type should open a modal
  const shouldOpenModal = (deviceType) => {
    const type = deviceType?.toUpperCase();
    return (
      type === "CAMERA" ||
      type === "SECURITYCAMERA" ||
      type === "LIGHT" ||
      type === "SMARTLIGHT" ||
      type === "THERMOSTAT" ||
      type === "SMARTTHERMOSTAT"
    );
  };

  // Determine what message to show when no devices are displayed
  const renderEmptyState = () => {
    if (
      searchTerm &&
      roomFilteredDevices.length > 0 &&
      filteredDevices.length === 0
    ) {
      return (
        <p className="empty-devices-msg">
          There are no devices with that name.
        </p>
      );
    } else if (activeRoom !== "All" && roomFilteredDevices.length === 0) {
      return <p className="empty-devices-msg">No devices in this room yet</p>;
    } else if (activeRoom === "All" && filteredDevices.length === 0) {
      return <p className="empty-devices-msg">No devices found</p>;
    }
    return null;
  };

  if (filteredDevices.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="devices-grid">
      {filteredDevices.map((device, index) => (
        <div
          key={device.deviceId || index}
          data-testid="device-card"
          className={`device-card ${device.isOn ? "is-on" : "is-off"} ${
            shouldOpenModal(device.deviceType) ? "clickable" : ""
          }`}
          onClick={() => {
            if (shouldOpenModal(device.deviceType)) {
              onCameraOpen(device); // Note: This prop name is kept for backwards compatibility
            }
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
              aria-label={`Toggle ${device.deviceName}`}
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
            className={`device-status-text ${device.isOn ? "" : "status-dim"}`}
          >
            {device.isOn ? "ON" : "OFF"}
          </span>
        </div>
      ))}
    </div>
  );
};
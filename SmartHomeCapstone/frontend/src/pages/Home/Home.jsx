import React, { useState } from "react";
import "./Home.css";
import { Lightbulb, Thermometer, Camera as CameraIcon } from "lucide-react";

/* ==================== Home Component ==================== */
export const Home = () => {
  /* ==================== State ==================== */
  const [rooms, setRooms] = useState([{ name: "All", active: true }]);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomError, setRoomError] = useState("");
  const [fadeOutRoom, setFadeOutRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [devices, setDevices] = useState([]);
  const [deviceError, setDeviceError] = useState("");
  const [fadeOutDevice, setFadeOutDevice] = useState(false);
  const [deviceType, setDeviceType] = useState("");
  const [deviceTypeError, setDeviceTypeError] = useState("");

  /* === Room Handlers === */
  const handleAddRoomClick = () => setShowAddRoomForm(true);

  const handleSaveRoom = () => {
    if (!newRoomName.trim()) {
      setRoomError("Room name is required");
      setFadeOutRoom(false);
      setTimeout(() => {
        setFadeOutRoom(true);
      }, 1500);
      setTimeout(() => {
        setRoomError("");
        setFadeOutRoom(false);
      }, 2250);
      return;
    }

    setRoomError("");
    const updatedRooms = rooms.map((r) => ({ ...r, active: false }));
    const newRoom = { name: newRoomName.trim(), active: true };
    setRooms([...updatedRooms, newRoom]);
    setNewRoomName("");
    setShowAddRoomForm(false);
  };

  const handleRoomClick = (roomName) => {
    setRooms(rooms.map((r) => ({ ...r, active: r.name === roomName })));
  };

  /* === Device Handlers === */
  const handleAddDeviceClick = () => {
    const realRooms = rooms.filter((r) => r.name !== "All");

    if (realRooms.length === 0) {
      setDeviceError("Create a room first");
      setFadeOutDevice(false);
      setTimeout(() => setFadeOutDevice(true), 1500);
      setTimeout(() => {
        setDeviceError("");
        setFadeOutDevice(false);
      }, 2250);
      return;
    }

    setShowAddDeviceForm(true);
  };

  const handleSaveDevice = () => {
    const activeRoom = rooms.find((r) => r.active)?.name;

    if (!deviceName.trim()) {
      setDeviceError("Device name is required");
      setFadeOutDevice(false);
      setTimeout(() => setFadeOutDevice(true), 1500);
      setTimeout(() => {
        setDeviceError("");
        setFadeOutDevice(false);
      }, 2250);
      return;
    }

    if (!deviceType) {
      setDeviceTypeError("Device type is required");
      setFadeOutDevice(false);
      setTimeout(() => setFadeOutDevice(true), 1500);
      setTimeout(() => {
        setDeviceTypeError("");
        setFadeOutDevice(false);
      }, 2250);
      return;
    }

    const realRooms = rooms.filter((r) => r.name !== "All");
    const roomToAssign =
      activeRoom === "All"
        ? realRooms.length === 1
          ? realRooms[0].name
          : selectedRoom
        : activeRoom;

    if (!roomToAssign) return;

    const offStatusByType = {
      Light: "Off",
      Thermostat: "Idle",
      Camera: "Offline",
    };

    setDevices([
      ...devices,
      {
        name: deviceName.trim(),
        room: roomToAssign,
        type: deviceType,
        status: offStatusByType[deviceType],
        isOn: false,
      },
    ]);

    setDeviceName("");
    setSelectedRoom("");
    setShowAddDeviceForm(false);
    setDeviceError("");
    setDeviceType("");

    setShowAddRoomForm(false);

    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        active: r.name === roomToAssign,
      })),
    );
  };

  const handleToggle = (deviceNameToFlip) => {
    const statusByType = {
      Light: "On",
      Thermostat: "Set to 72°F",
      Camera: "Online",
    };

    const offStatusByType = {
      Light: "Off",
      Thermostat: "Idle",
      Camera: "Offline",
    };

    setDevices((prev) =>
      prev.map((d) => {
        if (d.name !== deviceNameToFlip) return d;
        const nextOn = !d.isOn;
        return {
          ...d,
          isOn: nextOn,
          status: nextOn ? statusByType[d.type] : offStatusByType[d.type],
        };
      }),
    );
  };

  /* === Derived Values === */
  const activeRoom = rooms.find((r) => r.active)?.name;
  const filteredDevices =
    activeRoom === "All"
      ? devices
      : devices.filter((d) => d.room === activeRoom);

  const DeviceIcon = ({ type }) => {
    switch (type) {
      case "Light":
        return (
          <span role="img" aria-label="Light icon">
            <Lightbulb size={18} />
          </span>
        );
      case "Thermostat":
        return (
          <span role="img" aria-label="Thermostat icon">
            <Thermometer size={18} />
          </span>
        );
      case "Camera":
        return (
          <span role="img" aria-label="Camera icon">
            <CameraIcon size={18} />
          </span>
        );
      default:
        return null;
    }
  };

  /* ==================== Render ==================== */
  return (
    <div className="home">
      {/* === Room Error Toast === */}
      {roomError && (
        <div className={`toast-room-error ${fadeOutRoom ? "fade-out" : ""}`}>
          {roomError}
        </div>
      )}

      {/* === Rooms Bar === */}
      <div className="rooms-bar" role="navigation" aria-label="rooms">
        {rooms.map((room, index) => (
          <button
            key={index}
            className={room.active ? "active" : ""}
            onClick={() => handleRoomClick(room.name)}
          >
            {room.name}
          </button>
        ))}

        {!showAddRoomForm && (
          <button onClick={handleAddRoomClick}>+ Add</button>
        )}

        {showAddRoomForm && (
          <div className="add-room-form">
            <input
              placeholder="Room Name"
              value={newRoomName}
              onChange={(e) => {
                setNewRoomName(e.target.value);
                setRoomError("");
              }}
            />
            <button onClick={handleSaveRoom}>Save Room</button>
            <button onClick={() => setShowAddRoomForm(false)}>Cancel</button>
          </div>
        )}
      </div>

      {/* === Devices Section === */}
      <section className="devices-section">
        <div className="devices-header">
        {/* --- Devices Header & Add Button --- */}
          <h2>My Devices</h2>

          {!showAddDeviceForm && (
            <button
              data-testid="add-device-btn"
              className="add-device-btn"
              onClick={handleAddDeviceClick}
            >
              + Add Device
            </button>
          )}

          {showAddDeviceForm && (
            <div className="add-device-form">
            {/* --- Add Device Form --- */}
              <input
                placeholder="Device Name"
                value={deviceName}
                onChange={(e) => {
                  setDeviceName(e.target.value);
                  setDeviceError("");
                }}
              />
              <select
                aria-label="Select Type"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              >
                <option value="">-- Select Type --</option>
                <option value="Light">Light</option>
                <option value="Thermostat">Thermostat</option>
                <option value="Camera">Camera</option>
              </select>

              {deviceTypeError && (
                <div
                  className={`toast-device-error ${fadeOutDevice ? "fade-out" : ""}`}
                >
                  {deviceTypeError}
                </div>
              )}

              {activeRoom === "All" &&
                rooms.filter((r) => r.name !== "All").length > 1 && (
                  <select
                    aria-label="Select Room"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                  >
                    <option value="">-- Select Room --</option>
                    {rooms
                      .filter((r) => r.name !== "All")
                      .map((r, i) => (
                        <option key={i} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                  </select>
                )}

              <button
                onClick={handleSaveDevice}
                disabled={
                  activeRoom === "All" &&
                  rooms.filter((r) => r.name !== "All").length > 1 &&
                  !selectedRoom
                }
              >
                Save
              </button>
              <button onClick={() => setShowAddDeviceForm(false)}>
                Cancel
              </button>
            </div>
          )}

          {/* --- Device Error Toast --- */}
          {deviceError && (
            <div
              className={`toast-device-error ${fadeOutDevice ? "fade-out" : ""}`}
            >
              {deviceError}
            </div>
          )}
        </div>

        {/* === Devices List === */}
        <div className="devices-list">
          {activeRoom !== "All" && filteredDevices.length === 0 ? (
            <p className="empty-devices-msg">No devices in this room yet</p>
          ) : (
            <div className="devices-grid">
            {/* --- Device Cards Grid --- */}
              {filteredDevices.map((device, index) => (
                <div
                  key={index}
                  data-testid="device-card"
                  className={`device-card ${device.isOn ? "is-on" : "is-off"}`}
                >
                  <div className="device-card-header">
                    <div className="device-head-left">
                      <span className="icon-box">
                        <DeviceIcon type={device.type} />
                      </span>
                    </div>

                    <label
                      className="device-toggle"
                      aria-label={`Toggle ${device.name}`}
                    >
                      <input
                        type="checkbox"
                        checked={!!device.isOn}
                        onChange={() => handleToggle(device.name)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <span className={`device-title ${device.isOn ? "" : "dim"}`}>
                    {device.name}
                  </span>

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
          )}
        </div>
      </section>
    </div>
  );
};

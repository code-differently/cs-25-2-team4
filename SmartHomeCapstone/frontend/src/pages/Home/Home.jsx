import React from 'react';
import './Home.css';
import { useState } from 'react';

export const Home = () => {
  const [rooms, setRooms] = useState([{ name: 'All', active: true }]);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [devices, setDevices] = useState([]);
  
 // --- ROOM HANDLERS ---
  const handleAddRoomClick = () => {
    setShowAddRoomForm(true);
  };

  const handleSaveRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom = { name: newRoomName, active: true };

    // Deactivate all others (including All)
    const updatedRooms = rooms.map((room) => ({ ...room, active: false }));

    // Add and set new one as active
    setRooms([...updatedRooms, newRoom]);
    setNewRoomName('');
    setShowAddRoomForm(false);
  };

  // --- DEVICE HANDLERS ---
  const handleAddDeviceClick = () => {
    setShowAddDeviceForm(true);
  };

   const handleSaveDevice = () => {
    setDevices([...devices, { name: deviceName }]);
    setShowAddDeviceForm(false);
    setDeviceName('');
  };

  return (
    <div className="home">
        {/* Rooms bar */}
      <div className="rooms-bar" role="navigation" aria-label="rooms">
        {rooms.map((room, index) => (
          <button
            key={index}
            className={room.active ? 'active' : ''}
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
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={handleSaveRoom}>Save Room</button>
          </div>
        )}
      </div>
      {/* Devices Section */}
      <section className="devices-section">
        <div className="devices-header">
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
              <input
                placeholder="Device Name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />

              <select aria-label="Select Room">
                 {rooms.map((room) => (
                  <option key={room.name}>{room.name}</option>
                ))}
              </select>

              <button onClick={handleSaveDevice}>Save</button>
            </div>
          )} 
        </div>
       {/* Render devices */}
        <div className="devices-list">
          {devices.map((device, index) => (
            <div
              key={index}
              data-testid="device-card"
              className="device-card"
            >
              {device.name}
            </div>
            ))}
          </div>
      </section>

    </div>
  );
};

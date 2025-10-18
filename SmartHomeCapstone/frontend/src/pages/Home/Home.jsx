import React, { useState } from 'react';
import './Home.css';

export const Home = () => {

  const [rooms, setRooms] = useState([{ name: 'All', active: true }]);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomError, setRoomError] = useState('');


  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [devices, setDevices] = useState([]); 
  const [deviceError, setDeviceError] = useState('');



  const handleAddRoomClick = () => setShowAddRoomForm(true);

  const handleSaveRoom = () => {
    if (!newRoomName.trim()) {
        setRoomError('Room name is required');
        return;
    }

    setRoomError('');
    const updatedRooms = rooms.map((r) => ({ ...r, active: false }));
    const newRoom = { name: newRoomName.trim(), active: true };
    setRooms([...updatedRooms, newRoom]);
    setNewRoomName('');
    setShowAddRoomForm(false);
  };

  const handleRoomClick = (roomName) => {
    setRooms(rooms.map((r) => ({ ...r, active: r.name === roomName })));
  };

  const handleAddDeviceClick = () => setShowAddDeviceForm(true);

  const handleSaveDevice = () => {
    const activeRoom = rooms.find((r) => r.active)?.name;
    if (!deviceName.trim()) {
        setDeviceError('Device name is required');
        return;
    }

    setDevices([...devices, { name: deviceName.trim(), room: activeRoom }]);
    setDeviceName('');
    setShowAddDeviceForm(false);
    setDeviceError('');
  };


  const activeRoom = rooms.find((r) => r.active)?.name;
  const filteredDevices =
    activeRoom === 'All'
      ? devices
      : devices.filter((d) => d.room === activeRoom);

  return (
    <div className="home">
      <div className="rooms-bar" role="navigation" aria-label="rooms">
        {rooms.map((room, index) => (
          <button
            key={index}
            className={room.active ? 'active' : ''}
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
                        setRoomError('');   
                    }}
                />
                <button onClick={handleSaveRoom}>Save Room</button>
                <button onClick={() => setShowAddRoomForm(false)}>Cancel</button>
            </div>
            )}
        {roomError && (
            <div className="toast-error">
                {roomError}
            </div>
        )}
      </div>

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
                    onChange={(e) => {
                      setDeviceName(e.target.value);
                      setDeviceError('');
                    }}
                />
                <button onClick={handleSaveDevice}>Save</button>
                <button onClick={() => setShowAddDeviceForm(false)}>Cancel</button>
            </div>
          )}

          {deviceError && (
            <div className="toast-error">
                {deviceError}
            </div>
          )}

        </div>

        <div className="devices-list">
          {filteredDevices.map((device, index) => (
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

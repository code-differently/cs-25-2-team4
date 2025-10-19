import React, { useState } from 'react';
import './Home.css';

export const Home = () => {

  const [rooms, setRooms] = useState([{ name: 'All', active: true }]);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomError, setRoomError] = useState('');
  const [fadeOutRoom, setFadeOutRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');


  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [devices, setDevices] = useState([]); 
  const [deviceError, setDeviceError] = useState('');
  const [fadeOutDevice, setFadeOutDevice] = useState(false);
  const [deviceType, setDeviceType] = useState('');



  const handleAddRoomClick = () => setShowAddRoomForm(true);

  const handleSaveRoom = () => {
    if (!newRoomName.trim()) {
        setRoomError('Room name is required');
        setFadeOutRoom(false);
        setTimeout(() => { setFadeOutRoom(true); }, 1500);
        setTimeout(() => { setRoomError(''); setFadeOutRoom(false); }, 2250);
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
        setFadeOutDevice(false);
        setTimeout(() => setFadeOutDevice(true), 1500);
        setTimeout(() => {
        setDeviceError('');
        setFadeOutDevice(false);
    }, 2250);
    return;
    }

    const realRooms = rooms.filter(r => r.name !== 'All');
    const roomToAssign =
      activeRoom === 'All'
        ? (realRooms.length === 1 ? realRooms[0].name : selectedRoom)
        : activeRoom;

    if (!roomToAssign) return;

        const statusByType = {
            Light: 'On',
            Thermostat: 'Set to 72°F',
            Camera: 'Online',
            };

        setDevices([...devices, { name: deviceName.trim(), room: roomToAssign, type: deviceType, status: statusByType[deviceType], }]);

        setDeviceName('');
        setSelectedRoom('');          
        setShowAddDeviceForm(false);
        setDeviceError('');
        setDeviceType('');

        setShowAddRoomForm(false);

        setRooms(prev =>
          prev.map(r => ({
            ...r,
            active: r.name === roomToAssign
          }))
        );
    };



  const activeRoom = rooms.find((r) => r.active)?.name;
  const filteredDevices =
    activeRoom === 'All'
      ? devices
      : devices.filter((d) => d.room === activeRoom);

  return (
    <div className="home">
        {roomError && (
            <div className={`toast-room-error ${fadeOutRoom ? 'fade-out' : ''}`}>
                {roomError}
            </div>
        )}
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


                        {activeRoom === 'All' && rooms.filter(r => r.name !== 'All').length > 1 && (
                            <select
                                aria-label="Select Room"
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                            >
                            <option value="">-- Select Room --</option>
                                {rooms
                                    .filter(r => r.name !== 'All')
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
                                !deviceType ||
                                (activeRoom === 'All' && rooms.filter(r => r.name !== 'All').length > 1 && !selectedRoom)
                            }
                        >
                        Save
                        </button>
                        <button onClick={() => setShowAddDeviceForm(false)}>Cancel</button>
                        </div>
                )}

          {deviceError && (
            <div className={`toast-device-error ${fadeOutDevice ? 'fade-out' : ''}`}>
                {deviceError}
            </div>
          )}

        </div>

        <div className="devices-list">
          {activeRoom !== 'All' && filteredDevices.length === 0 ? (
            <p className="empty-devices-msg">No devices in this room yet</p>
          ) : (
            filteredDevices.map((device, index) => (
              <div key={index} data-testid="device-card" className="device-card">
                {device.name} ({device.type}) — {device.status}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

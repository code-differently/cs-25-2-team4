import React from "react";

export const RoomsBar = ({
  rooms,
  showAddRoomForm,
  newRoomName,
  roomError,
  fadeOutRoom,
  onRoomClick,
  onAddRoomClick,
  onNewRoomNameChange,
  onSaveRoom,
  onCancelAddRoom,
}) => {
  return (
    <>
      {/* Add Room Section - Above the nav bar */}
      <div className="add-room-section">
        {!showAddRoomForm && <button onClick={onAddRoomClick}>+ Add Room</button>}

        {showAddRoomForm && (
          <div className="add-room-form">
            <input
              placeholder="Room Name"
              value={newRoomName}
              onChange={(e) => onNewRoomNameChange(e.target.value)}
            />
            <button onClick={onSaveRoom}>Save Room</button>
            <button onClick={onCancelAddRoom}>Cancel</button>

            {roomError && (
              <div className={`toast-room-error ${fadeOutRoom ? "fade-out" : ""}`}>
                {roomError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rooms Navigation Bar */}
      <div className="rooms-bar" role="navigation" aria-label="rooms">
        {rooms.map((room, index) => (
          <button
            key={index}
            className={room.active ? "active" : ""}
            onClick={() => onRoomClick(room.name)}
          >
            {room.name}
          </button>
        ))}
      </div>
    </>
  );
};

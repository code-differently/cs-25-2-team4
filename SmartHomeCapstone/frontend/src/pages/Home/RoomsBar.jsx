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
    <div className="rooms-bar" role="navigation" aria-label="rooms">
      {/* Existing room buttons */}
      {rooms.map((room, index) => (
        <button
          key={index}
          className={room.active ? "active" : ""}
          onClick={() => onRoomClick(room.name)}
        >
          {room.name}
        </button>
      ))}

      {/* + Add button */}
      {!showAddRoomForm && <button onClick={onAddRoomClick}>+ Add</button>}

      {/* Add-room form */}
      {showAddRoomForm && (
        <div className="add-room-form">
          <input
            placeholder="Room Name"
            value={newRoomName}
            onChange={(e) => onNewRoomNameChange(e.target.value)}
          />
          <button onClick={onSaveRoom}>Save Room</button>
          <button onClick={onCancelAddRoom}>Cancel</button>
        </div>
      )}

      {roomError && (
        <div className={`toast-room-error ${fadeOutRoom ? "fade-out" : ""}`}>
          {roomError}
        </div>
      )}
    </div>
  );
};

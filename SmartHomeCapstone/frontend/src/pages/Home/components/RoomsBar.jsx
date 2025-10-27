import React from "react";
import { X } from "lucide-react";

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
  onDeleteRoom,
}) => {
  const [hoveredRoom, setHoveredRoom] = React.useState(null);

  return (
    <>
      <div className="add-room-row">
        {/* Rooms Navigation Bar */}
        <div className="rooms-bar" role="navigation" aria-label="rooms">
          {rooms.map((room, index) => {
            const isAll = room.name === "All";
            return (
              <button
                key={index}
                className={room.active ? "active" : ""}
                onClick={() => onRoomClick(room.name)}
                type="button"
                onMouseEnter={() => setHoveredRoom(room.name)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <span className="room-label">{room.name}</span>

                {!isAll && hoveredRoom === room.name && (
                  <span
                    className="room-delete-icon"
                    role="button"
                    aria-label={`Delete ${room.name}`}
                    title={`Delete ${room.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRoom?.(room.name);
                    }}
                  >
                    <X size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

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
      </div>
    </>
  );
};

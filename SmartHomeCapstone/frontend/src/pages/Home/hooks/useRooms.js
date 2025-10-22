import { useState } from "react";

export function useRooms() {
  const [rooms, setRooms] = useState([{ name: "All", active: true }]);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomError, setRoomError] = useState("");
  const [fadeOutRoom, setFadeOutRoom] = useState(false);

  // --- open form ---
  const openAddRoomForm = () => setShowAddRoomForm(true);

  // --- cancel form ---
  const cancelAddRoomForm = () => {
    setShowAddRoomForm(false);
    setNewRoomName("");
    setRoomError("");
  };

  // --- activate a room ---
  const activateRoom = (roomName) => {
    setRooms((prev) =>
      prev.map((r) => ({ ...r, active: r.name === roomName })),
    );
  };

  // --- add new room (with validation + auto-activate) ---
  const addRoom = () => {
    if (!newRoomName.trim()) {
      setRoomError("Room name is required");
      setFadeOutRoom(false);
      setTimeout(() => setFadeOutRoom(true), 1500);
      setTimeout(() => {
        setRoomError("");
        setFadeOutRoom(false);
      }, 2250);
      return;
    }

    setRoomError("");
    setFadeOutRoom(false);

    // deactivate all, then add new as active
    setRooms((prev) => {
      const updated = prev.map((r) => ({ ...r, active: false }));
      return [...updated, { name: newRoomName.trim(), active: true }];
    });

    setNewRoomName("");
    setShowAddRoomForm(false);
  };

  return {
    rooms,
    roomError,
    fadeOutRoom,
    newRoomName,
    showAddRoomForm,

    openAddRoomForm,
    cancelAddRoomForm,
    setNewRoomName,
    activateRoom,
    addRoom,
    setRooms,
  };
}

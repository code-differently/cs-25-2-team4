import { useState, useEffect, useCallback } from 'react';
import { roomService } from '../services/roomService';

export const useRooms = (homeId = 1) => {
  const [rooms, setRooms] = useState([{ name: "All", active: true }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomError, setRoomError] = useState("");
  const [fadeOutRoom, setFadeOutRoom] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getRoomsByHome(homeId);
      
      // Transform backend room data to include frontend state
      const transformedRooms = [
        { name: "All", active: true },
        ...data.map(room => ({
          id: room.roomId,
          name: room.name,
          homeId: room.homeId,
          deviceCount: room.devices ? room.devices.length : 0,
          active: false,
        }))
      ];
      
      setRooms(transformedRooms);
    } catch (err) {
      setError(err.message);
      // Fallback to just "All" room on error
      setRooms([{ name: "All", active: true }]);
    } finally {
      setLoading(false);
    }
  }, [homeId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

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
  const addRoom = async () => {
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

    try {
      setRoomError("");
      setFadeOutRoom(false);

      // Create room in backend
      const newRoom = await roomService.createRoom({
        name: newRoomName.trim(),
        homeId: homeId,
      });

      // Transform and add to local state
      const transformedRoom = {
        id: newRoom.roomId,
        name: newRoom.name,
        homeId: newRoom.homeId,
        deviceCount: 0,
        active: true,
      };

      // deactivate all existing rooms, then add new as active
      setRooms((prev) => {
        const updated = prev.map((r) => ({ ...r, active: false }));
        return [...updated, transformedRoom];
      });

      setNewRoomName("");
      setShowAddRoomForm(false);
    } catch (err) {
      setRoomError(err.message || "Failed to create room");
      setFadeOutRoom(false);
      setTimeout(() => setFadeOutRoom(true), 1500);
      setTimeout(() => {
        setRoomError("");
        setFadeOutRoom(false);
      }, 2250);
    }
  };

  const refreshRooms = () => {
    fetchRooms();
  };

  return {
    rooms,
    loading,
    error,
    roomError,
    fadeOutRoom,
    newRoomName,
    showAddRoomForm,

    openAddRoomForm,
    cancelAddRoomForm,
    setNewRoomName,
    activateRoom,
    addRoom,
    refreshRooms,
  };
};
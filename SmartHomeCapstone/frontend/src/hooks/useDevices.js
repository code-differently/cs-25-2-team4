import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '../services/deviceService';

// Custom hook for fetching all devices
export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deviceService.getAllDevices();
      setDevices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const refreshDevices = () => {
    fetchDevices();
  };

  const addDevice = async (deviceData) => {
    try {
      const newDevice = await deviceService.createDevice(deviceData);
      setDevices(prev => [...prev, newDevice]);
      return newDevice;
    } catch (err) {
      throw err;
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      await deviceService.deleteDevice(deviceId);
      setDevices(prev => prev.filter(device => device.id !== deviceId));
    } catch (err) {
      throw err;
    }
  };

  const toggleDevice = async (deviceId, currentStatus) => {
    try {
      if (currentStatus === 'ON') {
        await deviceService.turnDeviceOff(deviceId);
      } else {
        await deviceService.turnDeviceOn(deviceId);
      }
      // Update the device status in local state
      setDevices(prev => 
        prev.map(device => 
          device.id === deviceId 
            ? { ...device, status: currentStatus === 'ON' ? 'OFF' : 'ON' }
            : device
        )
      );
    } catch (err) {
      throw err;
    }
  };

  return { 
    devices, 
    loading, 
    error, 
    refreshDevices, 
    addDevice, 
    deleteDevice, 
    toggleDevice 
  };
};

// Backward compatibility
export const getDevices = useDevices;

// Hook for devices by room
export const useDevicesByRoom = (roomId) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(async () => {
    if (!roomId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await deviceService.getDevicesByRoom(roomId);
      setDevices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { devices, loading, error, refreshDevices: fetchDevices };
};

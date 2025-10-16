import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '../services/deviceService';

// Custom hook for fetching all devices
export const getDevices = () => {
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

  return { devices, loading, error, refreshDevices };
};

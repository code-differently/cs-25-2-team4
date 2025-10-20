import { useEffect, useState } from "react";
import { deviceService } from "../services/deviceService";

export default function Devices() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const devices = await deviceService.getAllDevices();
      setData(devices);
    } catch (e) {
      setError(e.message || "Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div style={{ padding: 12 }}>Loading…</div>;
  if (error) return (
    <div style={{ padding: 12, border: '1px solid #f5c6cb', background: '#fdecea', borderRadius: 8 }}>
      <strong>Unable to load devices</strong>
      <div>{error}</div>
      <button onClick={load} style={{ marginTop: 8 }}>Retry</button>
    </div>
  );
  const handleToggleDevice = async (deviceId, currentStatus) => {
    try {
      if (currentStatus === 'ON') {
        await deviceService.turnDeviceOff(deviceId);
      } else {
        await deviceService.turnDeviceOn(deviceId);
      }
      // Refresh the device list to show updated status
      load();
    } catch (error) {
      setError(`Failed to toggle device: ${error.message}`);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    if (!confirm('Are you sure you want to delete this device?')) {
      return;
    }

    try {
      await deviceService.deleteDevice(deviceId);
      load(); // Refresh the list
    } catch (error) {
      setError(`Failed to delete device: ${error.message}`);
    }
  };

  if (!data || data.length === 0) return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Devices</h2>
        <a href="/device-add" style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: 4
        }}>Add Device</a>
      </div>
      <div>No devices yet.</div>
    </div>
  );

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Devices</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Refresh
          </button>
          <a href="/device-add" style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4
          }}>Add Device</a>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {data.map(device => (
          <div key={device.id} style={{
            padding: 16,
            border: '1px solid #ddd',
            borderRadius: 8,
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>{device.name}</h3>
              <p style={{ margin: '0 0 4px 0', color: '#666' }}>
                <strong>Type:</strong> {device.type}
              </p>
              {device.roomId && (
                <p style={{ margin: '0 0 4px 0', color: '#666' }}>
                  <strong>Room:</strong> {device.roomId}
                </p>
              )}
              <p style={{ margin: 0, color: '#666' }}>
                <strong>Status:</strong>
                <span style={{
                  marginLeft: 8,
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: '0.8em',
                  backgroundColor: device.status === 'ON' ? '#d4edda' : '#f8d7da',
                  color: device.status === 'ON' ? '#155724' : '#721c24'
                }}>
                  {device.status || 'OFF'}
                </span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleToggleDevice(device.id, device.status)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: device.status === 'ON' ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }}
              >
                Turn {device.status === 'ON' ? 'Off' : 'On'}
              </button>
              <button
                onClick={() => handleDeleteDevice(device.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

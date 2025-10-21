import { useEffect, useState } from "react";
import { deviceService } from "../services/deviceService";
import "./Device.css";

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

  if (loading) return <div className="device-loading">Loading…</div>;
  if (error) return (
    <div className="device-error">
      <strong>Unable to load devices</strong>
      <div>{error}</div>
      <button onClick={load}>Retry</button>
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
    // eslint-disable-next-line no-restricted-globals
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
    <div className="devices-container">
      <div className="devices-header">
        <h2>Devices</h2>
        <a href="/device-add" className="btn btn-primary">Add Device</a>
      </div>
      <div className="devices-empty">No devices yet.</div>
    </div>
  );

  return (
    <div className="devices-container">
      <div className="devices-header">
        <h2>Devices</h2>
        <div className="devices-header-actions">
          <button onClick={load} className="btn btn-secondary">
            Refresh
          </button>
          <a href="/device-add" className="btn btn-primary">Add Device</a>
        </div>
      </div>

      <div className="devices-grid">
        {data.map(device => (
          <div key={device.id} className="device-card">
            <div className="device-info">
              <h3>{device.name}</h3>
              <p>
                <strong>Type:</strong> {device.type}
              </p>
              {device.roomId && (
                <p>
                  <strong>Room:</strong> {device.roomId}
                </p>
              )}
              <p>
                <strong>Status:</strong>
                <span className={`device-status ${device.status === 'ON' ? 'on' : 'off'}`}>
                  {device.status || 'OFF'}
                </span>
              </p>
            </div>

            <div className="device-actions">
              <button
                onClick={() => handleToggleDevice(device.id, device.status)}
                className={`btn btn-small ${device.status === 'ON' ? 'btn-danger' : 'btn-success'}`}
              >
                Turn {device.status === 'ON' ? 'Off' : 'On'}
              </button>
              <button
                onClick={() => handleDeleteDevice(device.id)}
                className="btn btn-small btn-danger"
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

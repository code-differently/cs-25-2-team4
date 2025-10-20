import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deviceService } from "../services/deviceService";

export default function DeviceAdd() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    roomId: "",
    homeId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await deviceService.createDevice(formData);
      navigate("/devices");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h1>Add Device</h1>
      {error && (
        <div style={{
          padding: 8,
          marginBottom: 12,
          border: '1px solid #f5c6cb',
          background: '#fdecea',
          borderRadius: 4,
          color: '#721c24'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: 4 }}>
            Device Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="type" style={{ display: 'block', marginBottom: 4 }}>
            Device Type:
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
          >
            <option value="">Select a type</option>
            <option value="LIGHT">Light</option>
            <option value="THERMOSTAT">Thermostat</option>
            <option value="CAMERA">Security Camera</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="roomId" style={{ display: 'block', marginBottom: 4 }}>
            Room ID:
          </label>
          <input
            type="text"
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="homeId" style={{ display: 'block', marginBottom: 4 }}>
            Home ID:
          </label>
          <input
            type="text"
            id="homeId"
            name="homeId"
            value={formData.homeId}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Device'}
          </button>
          <button
            type="button"
            onClick={() => navigate("/devices")}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

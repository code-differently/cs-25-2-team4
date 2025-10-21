import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deviceService } from "../services/deviceService";
import "./Device.css";

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
        <div className="device-add-container">
            <h1>Add Device</h1>
            {error && (
                <div className="device-error">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="device-add-form">
                <div className="form-group">
                    <label htmlFor="name">
                        Device Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="type">
                        Device Type:
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                    >
                        <option value="">Select a type</option>
                        <option value="LIGHT">Light</option>
                        <option value="THERMOSTAT">Thermostat</option>
                        <option value="CAMERA">Security Camera</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="roomId">
                        Room ID:
                    </label>
                    <input
                        type="text"
                        id="roomId"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="homeId">
                        Home ID:
                    </label>
                    <input
                        type="text"
                        id="homeId"
                        name="homeId"
                        value={formData.homeId}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Adding...' : 'Add Device'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/devices")}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

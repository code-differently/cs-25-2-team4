import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deviceService } from "../services/deviceService";
import "./Device.css";

export default function DeviceRemove() {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const deviceData = await deviceService.getDeviceById(deviceId);
                setDevice(deviceData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (deviceId) {
            fetchDevice();
        }
    }, [deviceId]);

    const handleDelete = async () => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm(`Are you sure you want to delete "${device?.name}"? This action cannot be undone.`)) {
            return;
        }

        setDeleting(true);
        setError("");

        try {
            await deviceService.deleteDevice(deviceId);
            navigate("/devices");
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <div className="device-loading">Loading device details...</div>;
    }

    if (error && !device) {
        return (
            <div className="device-remove-container">
                <h1>Remove Device</h1>
                <div className="device-error">
                    {error}
                </div>
                <button
                    onClick={() => navigate("/devices")}
                    className="btn btn-secondary"
                >
                    Back to Devices
                </button>
            </div>
        );
    }

    return (
        <div className="device-remove-container">
            <h1>Remove Device</h1>
            {error && (
                <div className="device-error">
                    {error}
                </div>
            )}
            {device && (
                <div className="device-details">
                    <h3>Device Details</h3>
                    <p><strong>ID:</strong> {device.id}</p>
                    <p><strong>Name:</strong> {device.name}</p>
                    <p><strong>Type:</strong> {device.type}</p>
                    {device.roomId && <p><strong>Room ID:</strong> {device.roomId}</p>}
                    {device.homeId && <p><strong>Home ID:</strong> {device.homeId}</p>}
                </div>
            )}
            <div className="device-remove-actions">
                <button
                    onClick={handleDelete}
                    disabled={deleting || !device}
                    className="btn btn-danger"
                >
                    {deleting ? 'Deleting...' : 'Delete Device'}
                </button>
                <button
                    onClick={() => navigate("/devices")}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

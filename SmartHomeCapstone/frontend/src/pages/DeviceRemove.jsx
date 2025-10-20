import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deviceService } from "../services/deviceService";

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
        return <div style={{ padding: 12 }}>Loading device details...</div>;
    }

    if (error && !device) {
        return (
            <div style={{ padding: 12 }}>
                <h1>Remove Device</h1>
                <div style={{
                    padding: 8,
                    border: '1px solid #f5c6cb',
                    background: '#fdecea',
                    borderRadius: 4,
                    color: '#721c24',
                    marginBottom: 12
                }}>
                    {error}
                </div>
                <button
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
                    Back to Devices
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: 12 }}>
            <h1>Remove Device</h1>
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
            {device && (
                <div style={{
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    marginBottom: 12,
                    backgroundColor: '#f8f9fa'
                }}>
                    <h3>Device Details</h3>
                    <p><strong>ID:</strong> {device.id}</p>
                    <p><strong>Name:</strong> {device.name}</p>
                    <p><strong>Type:</strong> {device.type}</p>
                    {device.roomId && <p><strong>Room ID:</strong> {device.roomId}</p>}
                    {device.homeId && <p><strong>Home ID:</strong> {device.homeId}</p>}
                </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    onClick={handleDelete}
                    disabled={deleting || !device}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: deleting || !device ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: deleting || !device ? 'not-allowed' : 'pointer'
                    }}
                >
                    {deleting ? 'Deleting...' : 'Delete Device'}
                </button>
                <button
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
        </div>
    );
}

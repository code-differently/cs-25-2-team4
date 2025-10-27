import React, { useState, useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import { deviceService } from "../../../../services/deviceService";

export const ThermostatModal = ({ device, onClose, onToggle, onRequestDelete, onDeviceUpdate }) => {
  const [setpoint, setSetpoint] = useState(72);
  const [isEditing, setIsEditing] = useState(false);
  const [tempInput, setTempInput] = useState("72");
  const setpointTimeoutRef = useRef(null);

  useEffect(() => {
    if (!device) return;
    const temp = Number.isFinite(device?.targetTemp) ? device.targetTemp : 72;
    setSetpoint(temp);
    setTempInput(String(temp));
  }, [device]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (setpointTimeoutRef.current) {
        clearTimeout(setpointTimeoutRef.current);
      }
    };
  }, []);

  if (!device) return null;

  const updateSetpointOnBackend = async (newSetpoint) => {
    try {
      // Ensure we're sending a proper number (Double)
      const setpointValue = parseFloat(newSetpoint);
      
      if (isNaN(setpointValue)) {
        console.error('Invalid setpoint value:', newSetpoint);
        return;
      }
      
      const updatedDevice = await deviceService.updateSetpoint(device.deviceId, setpointValue);
      
      // Update the device in parent state if callback provided
      if (onDeviceUpdate && updatedDevice) {
        onDeviceUpdate(updatedDevice);
      }
    } catch (error) {
      console.error('Failed to update setpoint:', error);
      // Optionally show an error toast to the user
    }
  };

  const handleSetpointChange = (e) => {
    const newSetpoint = Number(e.target.value);
    setSetpoint(newSetpoint);
    setTempInput(e.target.value);

    // Clear any existing timeout
    if (setpointTimeoutRef.current) {
      clearTimeout(setpointTimeoutRef.current);
    }

    // Debounce the API call - wait 500ms after user stops dragging
    setpointTimeoutRef.current = setTimeout(() => {
      updateSetpointOnBackend(newSetpoint);
    }, 500);
  };

  const handleTempClick = () => {
    setIsEditing(true);
  };

  const handleTempInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setTempInput(value);
    }
  };

  const handleTempInputBlur = () => {
    setIsEditing(false);
    let temp = parseInt(tempInput, 10);
    
    // Validate range
    if (isNaN(temp)) {
      temp = setpoint; // Revert to previous value
    } else {
      temp = Math.max(50, Math.min(100, temp)); // Clamp between 50-100
    }
    
    setSetpoint(temp);
    setTempInput(String(temp));
    
    // Update backend immediately when user finishes typing
    updateSetpointOnBackend(temp);
  };

  const handleTempInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    } else if (e.key === "Escape") {
      setTempInput(String(setpoint));
      setIsEditing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card thermostat-modal ${!device.isOn ? "is-off" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* === Top Controls === */}
        <div className="modal-row top-controls">
          <label
            className="device-toggle"
            aria-label={`Toggle ${device.deviceName}`}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={!!device.isOn}
              onChange={() => onToggle(device.deviceId, device.isOn)}
            />
            <span className="slider"></span>
          </label>

          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete(device);
            }}
          >
            <Trash size={16} />
            <span>Delete</span>
          </button>
        </div>

        {/* === Title === */}
        <h2 className="modal-title">{device.deviceName} — Thermostat</h2>

        {/* === Temperature Dial === */}
        <div className="temperature-dial-container">
          <div 
            className={`temperature-dial ${isEditing ? "editing" : ""}`}
            onClick={handleTempClick}
          >
            {isEditing ? (
              <input
                type="text"
                value={tempInput}
                onChange={handleTempInputChange}
                onBlur={handleTempInputBlur}
                onKeyDown={handleTempInputKeyDown}
                className="temperature-input"
                autoFocus
                maxLength={3}
              />
            ) : (
              <div className="temperature-display">{setpoint}°</div>
            )}
          </div>
        </div>

        {/* === Setpoint Control === */}
        <label className="setpoint-control">Setpoint</label>
        <input
          type="range"
          min="50"
          max="100"
          value={setpoint}
          onChange={handleSetpointChange}
          className="setpoint-slider"
          aria-label="Setpoint"
        />
      </div>
    </div>
  );
};
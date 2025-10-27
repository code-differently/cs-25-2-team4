import React, { useState, useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import { deviceService } from "../../../../services/deviceService";

export const LightModal = ({ device, onClose, onToggle, onRequestDelete, onDeviceUpdate }) => {
  const [brightness, setBrightness] = useState(60);
  const [useFallback, setUseFallback] = useState(false);
  const brightnessTimeoutRef = useRef(null);
  const [isOn, setIsOn] = useState(!!device?.isOn);

  // Sync with device prop
  useEffect(() => {
    if (!device) return;
    setBrightness(Number.isFinite(device?.brightness) ? device.brightness : 60);
    setIsOn(!!device.isOn);
    setUseFallback(false);
  }, [device]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (brightnessTimeoutRef.current) {
        clearTimeout(brightnessTimeoutRef.current);
      }
    };
  }, []);

  if (!device) return null;

  const handleBrightnessChange = async (e) => {
    const newBrightness = Number(e.target.value);
    setBrightness(newBrightness);

    // Clear any existing timeout
    if (brightnessTimeoutRef.current) {
      clearTimeout(brightnessTimeoutRef.current);
    }

    // Debounce the API call - wait 500ms after user stops dragging
    brightnessTimeoutRef.current = setTimeout(async () => {
      try {
        // Ensure we're sending an integer
        const brightnessValue = parseInt(newBrightness, 10);
        
        if (isNaN(brightnessValue)) {
          console.error('Invalid brightness value:', newBrightness);
          return;
        }
        
        const updatedDevice = await deviceService.updateBrightness(device.deviceId, brightnessValue);
        
        // Update the device in parent state if callback provided
        if (onDeviceUpdate && updatedDevice) {
          onDeviceUpdate(updatedDevice);
        }
      } catch (error) {
        console.error('Failed to update brightness:', error);
        // Optionally show an error toast to the user
      }
    }, 500);
  };

  const handleToggle = () => {
    const currentState = isOn; // Capture CURRENT state
    const newState = !currentState;
    
    // Update local state optimistically
    setIsOn(newState);
    
    // Pass CURRENT state to onToggle (before the change)
    if (typeof onToggle === "function") {
      onToggle(device.deviceId, currentState);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card light-modal ${!isOn ? "is-off" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* === Top Controls === */}
        <div className="modal-row top-controls">
          <label
            className="device-toggle"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isOn}
              onChange={handleToggle}
              aria-label={`Toggle ${device.deviceName}`}
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
        <h2 className="modal-title">{device.deviceName} — Light</h2>

        {/* === Color Wheel === */}
        <div className="color-wheel-container">
          {useFallback ? (
            <div
              role="img"
              aria-label="Color wheel"
              className="color-wheel fallback"
            />
          ) : (
            <div className="color-wheel">
              <img
                src="/assets/light-wheel.png"
                alt="Color wheel"
                onError={() => setUseFallback(true)}
              />
            </div>
          )}
        </div>

        {/* === Brightness Control === */}
        <div className="brightness-control">
          <label className="brightness-label">Brightness</label>
          <span className="brightness-value-bubble">{brightness}</span>
        </div>

        <div className="brightness-slider-container">
          <input
            aria-label="Brightness"
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={handleBrightnessChange}
            disabled={!isOn}
          />
        </div>
      </div>
    </div>
  );
};
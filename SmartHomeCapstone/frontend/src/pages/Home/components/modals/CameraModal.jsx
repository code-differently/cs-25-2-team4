import React, { useState, useEffect } from "react";
import cameraGif from "../../../../assets/camera.gif";
import { Trash } from "lucide-react";

export const CameraModal = ({ device, onClose, onToggle, onRequestDelete }) => {
  // Sync local state with device prop
  const [isOn, setIsOn] = useState(!!device?.isOn);

  // Update local state when device prop changes
  useEffect(() => {
    setIsOn(!!device?.isOn);
  }, [device?.isOn]);

  // Early return after hooks
  if (!device || !device.deviceId || !device.deviceName) return null;

  const handleToggle = (e) => {
    e.stopPropagation();
    const currentState = isOn; // Capture the CURRENT state
    const newState = !currentState; // Calculate new state
    
    // Update local state optimistically
    setIsOn(newState);
    
    // Pass CURRENT state to onToggle (before the change)
    if (typeof onToggle === "function") {
      onToggle(device.deviceId, currentState);
    }
  };

  return (
    <div className="modal-backdrop" data-testid="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card camera-modal${!isOn ? " is-off" : ""}`}
        data-testid="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* === Top Controls === */}
        <div className="modal-row top-controls">
          <label className="device-toggle" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isOn}
              aria-label={`Toggle ${device.deviceName}`}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>

          <button
            type="button"
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onRequestDelete === "function") {
                onRequestDelete(device);
              }
            }}
          >
            <Trash size={16} />
            <span>Delete</span>
          </button>
        </div>

        {/* === Title === */}
        <h2 className="modal-title">{device.deviceName} — Camera</h2>

        {/* === Camera Feed === */}
        {device.deviceId && (
          <div className={`camera-feed${!isOn ? " off" : ""}`}>
            <img
              src={cameraGif}
              alt="Camera feed"
              draggable="false"
              className={isOn ? "" : "off"}
            />
            {!isOn && <div className="modal-dim-overlay"></div>}
          </div>
        )}
      </div>
    </div>
  );
};
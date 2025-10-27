import React, { useState } from "react";
import cameraGif from "../../../../assets/camera.gif";
import { Trash } from "lucide-react";

export const CameraModal = ({ device, onClose, onToggle, onRequestDelete }) => {
  // Always call hooks at the top level
  const [isOn, setIsOn] = useState(!!device?.isOn);

  // Early return after hooks
  if (!device || !device.deviceId || !device.deviceName) return null;

  const handleToggle = (e) => {
    e.stopPropagation();
    const newValue = e.target.checked;
    setIsOn(newValue);
    if (typeof onToggle === "function") {
      onToggle(device.deviceId, newValue);
    }
  };

  return (
    <div className="modal-backdrop" data-testid="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card camera-modal"
        data-testid="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {!isOn && <div className="modal-dim-overlay"></div>}

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
                onRequestDelete(device.deviceId);
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
          <div className="camera-feed">
            <img
              src={cameraGif}
              alt="Camera feed"
              draggable="false"
              className={isOn ? "" : "off"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

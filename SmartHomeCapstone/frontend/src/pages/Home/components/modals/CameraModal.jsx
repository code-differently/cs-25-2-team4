import React from "react";
import cameraGif from "../../../../assets/camera.gif";
import { Trash } from "lucide-react";

export const CameraModal = ({ device, onClose, onToggle, onRequestDelete }) => {
  if (!device) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card camera-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {!device.isOn && <div className="modal-dim-overlay"></div>}

        {/* === Top Controls === */}
        <div className="modal-row top-controls">
          <label
            className="device-toggle"
            aria-label={`Toggle ${device.name}`}
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
        <h2 className="modal-title">{device.name} — Camera</h2>

        {/* === Camera Feed === */}
        <div className={`camera-feed ${device.isOn ? "" : "off"}`}>
          <img src={cameraGif} alt="Camera feed" draggable="false" />
        </div>
      </div>
    </div>
  );
};

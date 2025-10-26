import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";

export const LightModal = ({ device, onClose, onToggle, onRequestDelete }) => {
  const [brightness, setBrightness] = useState(60);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!device) return;
    setBrightness(Number.isFinite(device?.brightness) ? device.brightness : 60);
    setUseFallback(false);
  }, [device]);

  if (!device) return null;

  const handleBrightnessChange = (e) => {
    setBrightness(Number(e.target.value));
    // TODO: Add API call to update brightness on backend if needed
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card light-modal ${!device.isOn ? "is-off" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* === Top Controls === */}
        <div className="modal-row top-controls">
          <label className="device-toggle" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={!!device.isOn}
              onChange={e => onToggle(device.deviceId, e.target.checked)}
              aria-label={`Toggle ${device.deviceName}`}
              disabled={!device}
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
            disabled={!device?.isOn}
          />
        </div>
      </div>
    </div>
  );
};
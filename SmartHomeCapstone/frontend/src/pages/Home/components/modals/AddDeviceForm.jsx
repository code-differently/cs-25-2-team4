import React, { useState } from "react";

export const AddDeviceForm = ({
  rooms,
  activeRoom,
  deviceName,
  deviceType,
  selectedRoom,
  deviceError,
  deviceTypeError,
  fadeOutDevice,
  onDeviceNameChange,
  onDeviceTypeChange,
  onRoomSelect,
  onSave,
  onCancel,
}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showInternetSearch, setShowInternetSearch] = useState(false);

  const realRooms = rooms.filter((r) => r.name !== "All");
  const shouldShowRoomSelect = activeRoom === "All" && realRooms.length > 1;

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleInternetSearch = () => {
    setShowInternetSearch(true);
  };

  const handleCloseQR = () => {
    setShowQRScanner(false);
  };

  const handleCloseInternet = () => {
    setShowInternetSearch(false);
  };

  return (
    <>
      <div className="add-device-form">
        <div className="add-method-selector">
          <button className="method-btn" onClick={handleQRScan} type="button">
            Scan QR Code
          </button>
          <button className="method-btn" onClick={handleInternetSearch} type="button">
            Auto-Detect
          </button>
        </div>

        <div className="manual-form">
          <input
            placeholder="Device Name"
            value={deviceName}
            onChange={(e) => onDeviceNameChange(e.target.value)}
          />

          <select
            aria-label="Select Type"
            value={deviceType}
            onChange={(e) => onDeviceTypeChange(e.target.value)}
          >
            <option value="">-- Select Type --</option>
            <option value="LIGHT">Light</option>
            <option value="THERMOSTAT">Thermostat</option>
            <option value="CAMERA">Security Camera</option>
          </select>

          {deviceTypeError && (
            <div className={`toast-device-error ${fadeOutDevice ? "fade-out" : ""}`}>
              {deviceTypeError}
            </div>
          )}

          {shouldShowRoomSelect && (
            <select
              aria-label="Select Room"
              value={selectedRoom}
              onChange={(e) => onRoomSelect(e.target.value)}
            >
              <option value="">-- Select Room --</option>
              {realRooms.map((r, i) => (
                <option key={i} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          )}

          <button onClick={onSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="modal-overlay" onClick={handleCloseQR}>
          <div className="modal-content qr-scanner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Scan Device QR Code</h3>
              <button className="close-btn" onClick={handleCloseQR}>×</button>
            </div>
            <div className="modal-body">
              <div className="qr-scanner-container">
                <div className="camera-viewport">
                  <div className="scanning-animation">
                    <div className="scan-line"></div>
                  </div>
                  <div className="corner-markers">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>
                  </div>
                  <div className="scanner-overlay">
                    <svg viewBox="0 0 24 24" className="camera-icon">
                      <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>
                    </svg>
                  </div>
                </div>
                <p className="scanner-instruction">
                  Position the QR code within the frame
                </p>
              </div>
              <button className="btn-secondary" onClick={handleCloseQR}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internet Search Modal */}
      {showInternetSearch && (
        <div className="modal-overlay" onClick={handleCloseInternet}>
          <div className="modal-content internet-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Searching for Devices</h3>
              <button className="close-btn" onClick={handleCloseInternet}>×</button>
            </div>
            <div className="modal-body">
              <div className="search-container">
                <div className="search-animation">
                  <div className="radar-pulse">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring"></div>
                  </div>
                  <svg viewBox="0 0 24 24" className="wifi-icon">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"/>
                    <path d="M9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z"/>
                    <path d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                  </svg>
                </div>
                <p className="search-status">
                  Scanning your network for compatible devices...
                </p>
                <div className="search-progress">
                  <div className="progress-bar"></div>
                </div>
              </div>
              <button className="btn-secondary" onClick={handleCloseInternet}>
                Cancel Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
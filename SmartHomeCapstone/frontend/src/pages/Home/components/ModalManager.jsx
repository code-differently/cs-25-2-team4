import React, { useState } from "react";
import { CameraModal } from "./modals/CameraModal.jsx";
import { LightModal } from "./modals/LightModal.jsx";
import { ThermostatModal } from "./modals/ThermostatModal.jsx";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal.jsx";

export const ModalManager = ({
  selectedDevice,
  modalType,
  onClose,
  onToggleDevice,
  onDeleteDevice,
  onRequestDelete,
  onConfirmDelete,
  onReturnToDevice,
  onDeviceUpdate,
}) => {
  const handleToggle = (deviceIdToFlip, currentIsOn) => {
    onToggleDevice(deviceIdToFlip, currentIsOn);
  };

  return (
    <>
      {/* Camera Modal */}
      {modalType === "camera" && selectedDevice && (
        <CameraModal
          device={selectedDevice}
          onClose={onClose}
          onToggle={handleToggle}
          onRequestDelete={onRequestDelete}
        />
      )}

      {/* Light Modal */}
      {modalType === "light" && selectedDevice && (
        <LightModal
          device={selectedDevice}
          onClose={onClose}
          onToggle={handleToggle}
          onRequestDelete={onRequestDelete}
          onDeviceUpdate={onDeviceUpdate}
        />
      )}

      {/* Thermostat Modal */}
      {modalType === "thermostat" && selectedDevice && (
        <ThermostatModal
          device={selectedDevice}
          onClose={onClose}
          onToggle={handleToggle}
          onRequestDelete={onRequestDelete}
          onDeviceUpdate={onDeviceUpdate}
        />
      )}

      {/* Confirm Delete Modal (overlay above device modal) */}
      {modalType === "confirm-delete" && selectedDevice && (
        <div className="confirm-overlay">
          <ConfirmDeleteModal
            type="device"
            targetName={selectedDevice.deviceName}
            onConfirm={onConfirmDelete}
            onCancel={onReturnToDevice}
          />
        </div>
      )}
    </>
  );
};

// Export the hook for external components to use
export const useModalManager = (onToggleDevice, onDeleteDevice, onUpdateDeviceInList) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openDeviceModal = (device) => {
    setSelectedDevice(device);
    
    // Determine modal type based on device type
    const deviceType = device.deviceType?.toUpperCase();
    
    if (deviceType === "CAMERA" || deviceType === "SECURITYCAMERA") {
      setModalType("camera");
    } else if (deviceType === "LIGHT") {
      setModalType("light");
    } else if (deviceType === "THERMOSTAT") {
      setModalType("thermostat");
    } else {
      // Default to camera if unknown
      setModalType("camera");
    }
  };

  const openCameraModal = openDeviceModal;

  const closeModal = () => {
    setSelectedDevice(null);
    setModalType(null);
  };

  const returnToDeviceModal = () => {
    if (selectedDevice) {
      const deviceType = selectedDevice.deviceType?.toUpperCase();
      
      if (deviceType === "CAMERA" || deviceType === "SECURITYCAMERA") {
        setModalType("camera");
      } else if (deviceType === "LIGHT") {
        setModalType("light");
      } else if (deviceType === "THERMOSTAT") {
        setModalType("thermostat");
      }
    }
  };

  const handleToggle = (deviceIdToFlip, currentIsOn) => {
    onToggleDevice(deviceIdToFlip, currentIsOn);
    setSelectedDevice((prev) => {
      if (!prev || prev.deviceId !== deviceIdToFlip) return prev;
      return {
        ...prev,
        isOn: !currentIsOn,
        status: !currentIsOn ? "Online" : "Offline",
      };
    });
  };

  const handleDeviceUpdate = (updatedDevice) => {
    // Update the selected device with new data from backend
    setSelectedDevice((prev) => {
      if (!prev || prev.deviceId !== updatedDevice.deviceId) return prev;
      return {
        ...prev,
        ...updatedDevice,
      };
    });

    // Also update the device in the main devices list
    if (onUpdateDeviceInList) {
      onUpdateDeviceInList(updatedDevice);
    }
  };

  const handleRequestDelete = (device) => {
    setSelectedDevice(device);
    setModalType("confirm-delete");
  };

  const confirmDeleteDevice = async () => {
    if (selectedDevice) {
      try {
        await onDeleteDevice(selectedDevice.deviceId);
        closeModal();
      } catch (error) {
        console.error('Failed to delete device:', error);
      }
    }
  };

  return {
    selectedDevice,
    modalType,
    openDeviceModal,
    openCameraModal,
    closeModal,
    requestDeleteDevice: handleRequestDelete,
    confirmDeleteDevice,
    returnToDeviceModal,
    returnToCameraModal: returnToDeviceModal,
    handleToggle,
    handleDeviceUpdate,
  };
};
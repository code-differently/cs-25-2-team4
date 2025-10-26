import React, { useState } from "react";
import { CameraModal } from "./modals/CameraModal.jsx";
import { LightModal } from "./modals/LightModal.jsx";
import { ThermostatModal } from "./modals/ThermostatModal.jsx";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal.jsx";

// Modal registry for device types
const MODAL_REGISTRY = {
  CAMERA: CameraModal,
  SECURITYCAMERA: CameraModal,
  LIGHT: LightModal,
  THERMOSTAT: ThermostatModal,
};

// Register new modals without modifying existing code
export const registerDeviceModal = (deviceType, ModalComponent) => {
  MODAL_REGISTRY[deviceType.toUpperCase()] = ModalComponent;
};

export const getModalForDevice = (deviceType) => {
  return MODAL_REGISTRY[deviceType?.toUpperCase()];
};

export const ModalManager = ({
  selectedDevice,
  modalType,
  onClose,
  onToggleDevice,
  onDeleteDevice,
  onRequestDelete,
  onConfirmDelete,
  onReturnToDevice,
}) => {
  const handleToggle = (deviceIdToFlip, currentIsOn) => {
    onToggleDevice(deviceIdToFlip, currentIsOn);
  };

  // Use registry for modal selection
  const DeviceModalComponent = getModalForDevice(selectedDevice?.deviceType);

  return (
    <>
      {selectedDevice && DeviceModalComponent && modalType !== "confirm-delete" && (
        <DeviceModalComponent
          device={selectedDevice}
          onClose={onClose}
          onToggle={handleToggle}
          onRequestDelete={onRequestDelete}
        />
      )}
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

export const useModalManager = (onToggleDevice, onDeleteDevice) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openDeviceModal = (device) => {
    setSelectedDevice(device);
    setModalType("device");
  };

  const closeModal = () => {
    setSelectedDevice(null);
    setModalType(null);
  };

  const returnToDeviceModal = () => {
    setModalType("device");
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
    closeModal,
    requestDeleteDevice: handleRequestDelete,
    confirmDeleteDevice,
    returnToDeviceModal,
    handleToggle,
  };
};
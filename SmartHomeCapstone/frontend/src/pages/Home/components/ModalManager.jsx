import React, { useState } from "react";
import { CameraModal } from "./modals/CameraModal.jsx";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal.jsx";
import LightModal from "./modals/LightModal.jsx";
import ThermostatModal from "./modals/ThermostatModal.jsx";

export const ModalManager = ({
  selectedDevice,
  modalType,
  onClose,
  onToggleDevice,
  onDeleteDevice,
  onRequestDelete,
  onConfirmDelete,
  onReturnToCamera,
}) => {
  const handleToggle = (deviceIdToFlip, currentIsOn) => {
    onToggleDevice(deviceIdToFlip, currentIsOn);
  };

  // Adapt the selectedDevice to the shapes Light/Thermostat modals expect
  const asLightDevice = (d) =>
    d
      ? {
          ...d,
          id: d.deviceId,
          name: d.name,
          power: !!d.isOn,
          brightness:
            typeof d.brightness === "number" ? d.brightness : 60,
        }
      : null;

  const asThermoDevice = (d) =>
    d
      ? {
          ...d,
          id: d.deviceId,
          name: d.name,
          power: !!d.isOn,
          setpoint:
            typeof d.setpoint === "number" ? d.setpoint : 72,
        }
      : null;

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

      {/* Light Modal (self-contained confirm inside the modal) */}
      {modalType === "light" && selectedDevice && (
        <LightModal
          open={true}
          onClose={onClose}
          onDelete={(id) => onDeleteDevice(id)}
          device={asLightDevice(selectedDevice)}
        />
      )}

      {/* Thermostat Modal (self-contained confirm inside the modal) */}
      {modalType === "thermostat" && selectedDevice && (
        <ThermostatModal
          open={true}
          onClose={onClose}
          onDelete={(id) => onDeleteDevice(id)}
          device={asThermoDevice(selectedDevice)}
        />
      )}

      {/* Confirm Delete Modal (camera flow keeps using the overlay) */}
      {modalType === "confirm-delete" && selectedDevice && (
        <div className="confirm-overlay">
          <ConfirmDeleteModal
            type="device"
            targetName={selectedDevice.name}
            onConfirm={onConfirmDelete}
            onCancel={onReturnToCamera}
          />
        </div>
      )}
    </>
  );
};

// Export the hook for external components to use
export const useModalManager = (onToggleDevice, onDeleteDevice) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openCameraModal = (device) => {
    setSelectedDevice(device);
    setModalType("camera");
  };

  // NEW: open helpers for Light/Thermostat
  const openLightModal = (device) => {
    setSelectedDevice(device);
    setModalType("light");
  };

  const openThermostatModal = (device) => {
    setSelectedDevice(device);
    setModalType("thermostat");
  };

  const closeModal = () => {
    setSelectedDevice(null);
    setModalType(null);
  };

  const returnToCameraModal = () => {
    setModalType("camera");
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
        console.error("Failed to delete device:", error);
      }
    }
  };

  return {
    selectedDevice,
    modalType,
    openCameraModal,
    openLightModal,
    openThermostatModal,
    closeModal,
    requestDeleteDevice: handleRequestDelete,
    confirmDeleteDevice,
    returnToCameraModal,
    handleToggle,
  };
};

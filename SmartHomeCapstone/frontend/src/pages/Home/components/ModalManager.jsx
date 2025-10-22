import React, { useState } from "react";
import { CameraModal } from "./modals/CameraModal.jsx";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal.jsx";

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

      {/* Confirm Delete Modal (overlay above camera modal) */}
      {modalType === "confirm-delete" && selectedDevice && (
        <div className="confirm-overlay">
          <ConfirmDeleteModal
            deviceName={selectedDevice.name}
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

  const closeModal = () => {
    setSelectedDevice(null);
    setModalType(null);
  };

  const requestDeleteDevice = (device) => {
    setSelectedDevice(device);
    setModalType("confirm-delete");
  };

  const confirmDeleteDevice = () => {
    if (!selectedDevice) return;
    onDeleteDevice(selectedDevice.name);
    closeModal();
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

  const handleConfirmDelete = () => {
    if (!selectedDevice) return;
    onDeleteDevice(selectedDevice.name);
    closeModal();
  };

  return {
    selectedDevice,
    modalType,
    openCameraModal,
    closeModal,
    requestDeleteDevice: handleRequestDelete,
    confirmDeleteDevice: handleConfirmDelete,
    returnToCameraModal,
    handleToggle,
  };
};
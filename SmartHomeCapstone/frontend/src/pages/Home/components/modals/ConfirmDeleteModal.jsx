import React from "react";

export const ConfirmDeleteModal = ({ deviceName, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
      <h3 className="confirm-title">Delete “{deviceName}”?</h3>
      <p className="confirm-text">This action cannot be undone.</p>

      <div className="confirm-actions">
        <button onClick={onConfirm} className="confirm-delete-btn">
          Delete
        </button>
        <button onClick={onCancel} className="confirm-cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

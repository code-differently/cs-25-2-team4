import React from "react";

export const ConfirmDeleteModal = ({ type, targetName, onConfirm, onCancel }) => {
  const isRoom = type === "room";
  const headingId = "confirm-delete-modal-title";
  return (
    <div
      className="confirm-modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onClick={(e) => e.stopPropagation()}
    >
      {isRoom ? (
        <>
          <h3 className="confirm-title" id={headingId}>
            Delete “{targetName}” and all devices inside it?
          </h3>
          <p className="confirm-text">This action cannot be undone.</p>
        </>
      ) : (
        <>
          <h3 className="confirm-title" id={headingId}>
            Remove Device “{targetName}”?
          </h3>
          <p className="confirm-text">This action cannot be undone.</p>
        </>
      )}

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

import { useEffect } from "react";

export default function ConfirmDeleteModal({
  open,
  title = "Delete device",
  deviceName,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={onCancel}
    >
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        onMouseDown={stop}
      >
        <header className="modal-header">
          <h3 id="confirm-delete-title">{title}</h3>
          <button className="icon-btn" aria-label="Close" onClick={onCancel}>✕</button>
        </header>

        <div className="modal-body">
          <p>
            Are you sure you want to delete <strong>{deviceName || "this device"}</strong>? This action cannot be undone.
          </p>
        </div>

        <footer className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </footer>
      </div>
    </div>
  );
}

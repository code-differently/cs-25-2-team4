import './modals.css';

export default function ConfirmDeleteModal({ open, title = "Are you sure?", onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card small" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

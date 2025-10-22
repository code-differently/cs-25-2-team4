import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "./modals.css";

export default function LightModal({ open, onClose, onDelete, name = "Light" }) {
  const [on, setOn] = useState(true);
  const [color, setColor] = useState("#4aa3ff");
  const [brightness, setBrightness] = useState(60);
  const [confirm, setConfirm] = useState(false);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="device-card light" onClick={(e) => e.stopPropagation()}>
        <div className="device-card-header">
          <div className={`pill ${on ? "on" : ""}`} onClick={() => setOn(v => !v)} />
          <div className="spacer" />
          <div className="top-actions">
            <button className="btn btn-ghost" onClick={() => setConfirm(true)}>Delete</button>
          </div>
        </div>

        <h2 className="device-title">{name}</h2>

        <div className="color-row">
          <input type="color" value={color} onChange={e => setColor(e.target.value)} aria-label="Light color" />
        </div>

        <label className="label">Brightness</label>
        <input type="range" min="0" max="100" value={brightness} onChange={e => setBrightness(e.target.value)} />
      </div>

      <ConfirmDeleteModal
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); onDelete?.(); onClose?.(); }}
      />
    </div>
  );
}

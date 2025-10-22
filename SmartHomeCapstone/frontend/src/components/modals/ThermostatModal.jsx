import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "./modals.css";

export default function ThermostatModal({ open, onClose, onDelete, name = "Thermostat" }) {
  const [on, setOn] = useState(true);
  const [temp, setTemp] = useState(72);
  const [confirm, setConfirm] = useState(false);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="device-card thermo" onClick={(e) => e.stopPropagation()}>
        <div className="device-card-header">
          <div className={`pill ${on ? "on" : ""}`} onClick={() => setOn(v => !v)} />
          <div className="spacer" />
          <div className="top-actions">
            <button className="btn btn-ghost" onClick={() => setConfirm(true)}>Delete</button>
          </div>
        </div>

        <h2 className="device-title">{name}</h2>

        <div className="knob">
          <div className="deg">{temp}°</div>
        </div>

        <label className="label">Setpoint</label>
        <input type="range" min="50" max="85" value={temp} onChange={e => setTemp(Number(e.target.value))} />
      </div>

      <ConfirmDeleteModal
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); onDelete?.(); onClose?.(); }}
      />
    </div>
  );
}

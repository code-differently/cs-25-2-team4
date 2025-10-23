import { useEffect, useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function ThermostatModal({ open, onClose, onDelete, device }) {
  const [confirm, setConfirm] = useState(false);
  const [power, setPower]   = useState(true);
  const [setpoint, setSetpoint] = useState(72);
  const name = device?.name || "Thermostat";

  useEffect(() => {
    if (!open) return;
    setPower(device?.power ?? true);
    setSetpoint(Number.isFinite(device?.setpoint) ? device.setpoint : 72);
  }, [open, device]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  // Backdrop
  const backdropStyle = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
  };

  // Card (blue gradient) — dims when off
  const cardStyle = {
    width: "min(980px, 92vw)",
    borderRadius: 24,
    padding: 24,
    color: "#fff",
    background: "linear-gradient(135deg, #2249b7 0%, #3f6eea 100%)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
    filter: power ? "none" : "brightness(0.78) saturate(0.9)",
    transition: "filter .18s ease-in-out",
  };

  // Dial styles
  const knobWrap = { display: "flex", justifyContent: "center", margin: "14px 0 22px" };
  const knob = {
    width: 220, height: 220, borderRadius: "50%",
    background: "radial-gradient(circle at 50% 42%, #181818 0%, #0f0f0f 55%, #000 100%)",
    boxShadow: "0 20px 40px rgba(0,0,0,.35)",
    border: "2px solid rgba(255,255,255,.12)",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const degStyle = { fontSize: 64, fontWeight: 700, color: "#cfe1ff", letterSpacing: 1 };

  return (
    <div className="modal-backdrop" style={backdropStyle} onMouseDown={onClose}>
      {/* Scoped fallback CSS so the pill toggle always renders */}
      <style>{`
        .device-card.thermo .thermo .pill{
          width:64px;height:34px;border-radius:999px;position:relative;cursor:pointer;
          background:#0f2344; box-shadow: inset 0 0 0 2px rgba(255,255,255,.15);
        }
        .device-card.thermo .thermo .pill::after{
          content:""; position:absolute; top:4px; left:4px; width:26px; height:26px;
          border-radius:50%; background:#e8edf7; box-shadow: 0 2px 6px rgba(0,0,0,.35);
          transition: transform .2s ease;
        }
        .device-card.thermo .thermo .pill.on{ background:#37b24d; }
        .device-card.thermo .thermo .pill.on::after{ transform: translateX(30px); }

        /* Optional: subtle focus ring for keyboard users */
        .device-card .top-actions .btn.btn-ghost:focus,
        .device-card .top-actions .btn.btn-ghost:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(255,255,255,.18), inset 0 0 0 1px rgba(255,255,255,.10) !important;
        }
      `}</style>

      <div
        className={`device-card thermo${power ? "" : " is-off"}`}
        style={cardStyle}
        onMouseDown={stop}
        role="dialog"
        aria-modal="true"
        aria-label="Thermostat"
      >
        {/* Header: pill toggle (left) + Delete (right) */}
        <div className="device-card-header" style={{ display: "flex", alignItems: "center" }}>
          <div className="thermo" style={{ marginRight: 12 }}>
            <div
              className={`pill ${power ? "on" : "off"}`}
              role="switch"
              aria-checked={power}
              aria-label={power ? "Turn off" : "Turn on"}
              onClick={() => setPower(p => !p)}
            />
          </div>

          <div style={{ flex: 1 }} />

          <div className="top-actions">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setConfirm(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(9,20,38,.72)", color: "#fff",
                borderRadius: 12, padding: "6px 12px", fontWeight: 600,
                backdropFilter: "saturate(140%) blur(2px)",
                border: "none", outline: "none", WebkitAppearance: "none", appearance: "none",
                boxShadow: "0 10px 24px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.10)"
              }}
              aria-label={`Delete ${name}`}
            >
              Delete
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" style={{ opacity: .9 }}>
                <path d="M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4v2H4V5h5V4zm-2 6h2v9H7v-9zm4 0h2v9h-2v-9zm4 0h2v9h-2v-9z"/>
              </svg>
            </button>
          </div>
        </div>

        <h2 className="device-title" style={{ fontSize: 32, fontWeight: 700, margin: "12px 0 0 0" }}>{name}</h2>

        {/* Big dial */}
        <div style={knobWrap}>
          <div style={knob}>
            <div style={degStyle}>{setpoint}°</div>
          </div>
        </div>

        <label className="label" style={{ color: "#e9eefc", fontSize: 18 }}>Setpoint</label>
        <input
          type="range"
          min="50"
          max="85"
          value={setpoint}
          onChange={(e) => setSetpoint(Number(e.target.value))}
          style={{ width: "100%" }}
          aria-label="Setpoint"
        />
      </div>

      <ConfirmDeleteModal
        open={confirm}
        deviceName={name}
        onCancel={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); onDelete?.(device?.id); onClose?.(); }}
      />
    </div>
  );
}

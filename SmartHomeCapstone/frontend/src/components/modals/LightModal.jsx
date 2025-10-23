import { useEffect, useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function LightModal({ open, onClose, onDelete, device }) {
  const [confirm, setConfirm] = useState(false);
  const [power, setPower] = useState(false);
  const [brightness, setBrightness] = useState(60);
  const [useFallback, setUseFallback] = useState(false);
  const name = device?.name || "Light";

  useEffect(() => {
    if (!open) return;
    setPower(Boolean(device?.power));
    setBrightness(Number.isFinite(device?.brightness) ? device.brightness : 60);
    setUseFallback(false);
  }, [open, device]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  // fixed, dim overlay
  const backdropStyle = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
  };

  // solid card (blue gradient) + dim when off
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

  const valueBubble = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minWidth: 22, height: 22, borderRadius: 4, padding: "0 6px",
    fontSize: 12, lineHeight: 1, color: "#fff", background: "rgba(0,0,0,0.5)",
    marginLeft: 8, userSelect: "none",
  };

  const wheelBase = {
    width: 260, height: 260, borderRadius: "50%",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    border: "2px solid rgba(255,255,255,0.15)", display: "block",
  };

  return (
    <div className="modal-backdrop" style={backdropStyle} onMouseDown={onClose}>
      {/* Scoped fallback CSS so the pill always renders */}
      <style>{`
        .device-card.light .thermo .pill{
          width:64px;height:34px;border-radius:999px;position:relative;cursor:pointer;
          background:#0f2344; box-shadow: inset 0 0 0 2px rgba(255,255,255,.15);
        }
        .device-card.light .thermo .pill::after{
          content:""; position:absolute; top:4px; left:4px; width:26px; height:26px;
          border-radius:50%; background:#e8edf7; box-shadow: 0 2px 6px rgba(0,0,0,.35);
          transition: transform .2s ease;
        }
        .device-card.light .thermo .pill.on{ background:#37b24d; }
        .device-card.light .thermo .pill.on::after{ transform: translateX(30px); }
      `}</style>

      <div
        className={`device-card light${power ? "" : " is-off"}`}
        style={cardStyle}
        onMouseDown={stop}
        role="dialog"
        aria-modal="true"
        aria-label="Light"
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
                background: "rgba(9,20,38,.7)", color: "#fff",
                borderRadius: 12, padding: "6px 12px", fontWeight: 600,
                border: "none", outline: "none", WebkitAppearance: "none", appearance: "none",
                backdropFilter: "saturate(140%) blur(2px)"
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

        <div style={{ display: "flex", justifyContent: "center", marginTop: 12, marginBottom: 20 }}>
          {useFallback ? (
            <div role="img" aria-label="Color wheel"
                 style={{ ...wheelBase, background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }} />
          ) : (
            <img
              src="/assets/light-wheel.png"
              alt="Color wheel"
              onError={() => setUseFallback(true)}
              style={{ ...wheelBase, objectFit: "cover" }}
            />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, paddingLeft: 16 }}>
          <label className="label" style={{ margin: 0, color: "#e9eefc", fontSize: 18 }}>Brightness</label>
          <span style={valueBubble}>{brightness}</span>
        </div>

        <div style={{ padding: "0 16px 12px 16px" }}>
          <input
            aria-label="Brightness"
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
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

import { useEffect, useState } from "react";

export default function Devices() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/devices`);
      if (!res.ok) {
        const msg =
          res.status === 404 ? "No devices found."
          : res.status === 401 ? "Please log in."
          : res.status >= 500 ? "Server error. Try again shortly."
          : "Failed to load devices.";
        throw new Error(msg);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || "Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div style={{padding:12}}>Loading…</div>;
  if (error) return (
    <div style={{padding:12, border:'1px solid #f5c6cb', background:'#fdecea', borderRadius:8}}>
      <strong>Unable to load devices</strong>
      <div>{error}</div>
      <button onClick={load} style={{marginTop:8}}>Retry</button>
    </div>
  );
  if (!data || data.length === 0) return <div style={{padding:12}}>No devices yet.</div>;

  return (
    <div style={{padding:12}}>
      <h2>Devices</h2>
      <ul>{data.map(d => <li key={d.id}>{d.name} — {d.category}</li>)}</ul>
      <button onClick={load}>Refresh</button>
    </div>
  );
}
